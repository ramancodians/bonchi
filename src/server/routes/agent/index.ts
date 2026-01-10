import { Router } from "express";
import {
    sendErrorResponse,
    sendSuccessResponse,
} from "../../utils/responseUtil";
import prisma from "../../db";
import { hashPassword } from "../../utils/securityUtils";

const AgentRouter = Router();

// Middleware to ensure user is Agent (Bonchi Mitra)
const ensureAgent = async (req: any, res: any, next: any) => {
    if (req.user?.role !== "BONCHI_MITRA") {
        return sendErrorResponse(res, { message: "Access denied. Agents only.", status: 403 });
    }
    // ensure partner record exists
    const partner = await prisma.bonchiMitraPartner.findUnique({ where: { user_id: req.user.id } });
    if (!partner) {
        return sendErrorResponse(res, { message: "Agent profile not found.", status: 404 });
    }
    req.partner = partner;
    next();
};

AgentRouter.use(ensureAgent);

// Get Dashboard Stats
AgentRouter.get("/dashboard", async (req, res) => {
    try {
        const agentId = (req as any).partner.id;

        const wallet = await prisma.agentWallet.findUnique({ where: { agent_id: agentId } }) || { balance: 0, total_earned: 0, total_spent: 0 };
        const totalUsers = await prisma.agentCreatedUser.count({ where: { agent_id: agentId } });

        // created this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const usersThisMonth = await prisma.agentCreatedUser.count({
            where: {
                agent_id: agentId,
                created_at: { gte: startOfMonth }
            }
        });

        const recentTransactions = await prisma.agentTransaction.findMany({
            where: { agent_id: agentId },
            orderBy: { created_at: "desc" },
            take: 5
        });

        return sendSuccessResponse(res, {
            data: {
                wallet,
                stats: { totalUsers, usersThisMonth },
                recentTransactions
            }
        });

    } catch (error) {
        return sendErrorResponse(res, { message: "Failed to fetch dashboard", status: 500 });
    }
});

// Get Wallet & Transactions
AgentRouter.get("/wallet", async (req, res) => {
    try {
        const agentId = (req as any).partner.id;
        const { page = "1", limit = "20" } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const wallet = await prisma.agentWallet.findUnique({ where: { agent_id: agentId } });
        const total = await prisma.agentTransaction.count({ where: { agent_id: agentId } });
        const transactions = await prisma.agentTransaction.findMany({
            where: { agent_id: agentId },
            orderBy: { created_at: "desc" },
            skip, take
        });

        return sendSuccessResponse(res, {
            data: {
                wallet,
                transactions,
                pagination: { total, take, skip }
            }
        });
    } catch (error) {
        return sendErrorResponse(res, { message: "Failed to fetch wallet", status: 500 });
    }
});

// Create User (Agent Action)
AgentRouter.post("/create-user", async (req, res) => {
    try {
        const {
            first_name, last_name, email, mobile, password,
            district, state, block, pincode // Address
        } = req.body;

        if (!mobile || !first_name || !password) return sendErrorResponse(res, { message: "Missing required fields", status: 400 });

        const agentId = (req as any).partner.id;

        // Get settings for fee
        const settings = await prisma.agentSettings.findFirst();
        const fee = settings ? parseFloat(settings.card_activation_fee.toString()) : 100; // Default 100

        const result = await prisma.$transaction(async (tx) => {
            // 1. Check Wallet
            const wallet = await tx.agentWallet.findUnique({ where: { agent_id: agentId } });
            if (!wallet || wallet.balance.toNumber() < fee) {
                throw new Error("Insufficient wallet balance");
            }

            // 2. Check User existence
            const existing = await tx.user.findUnique({ where: { mobile } });
            if (existing) throw new Error("User with mobile already exists");

            // 3. Create User
            const hashedPassword = await hashPassword(password);
            const newUser = await tx.user.create({
                data: {
                    first_name, last_name, email, mobile, password: hashedPassword,
                    district, state, block, pincode,
                    role: "CUSTOMER", // Basic user
                    // Assuming 'issued_cards' logic handles health card creation elsewhere or we do it here?
                    // Old code created health card too.
                }
            });

            // 4. Create Card (BonchiCard)
            const cardNumber = 'BON' + Math.floor(100000 + Math.random() * 900000);
            const card = await tx.bonchiCard.create({
                data: {
                    user_id: newUser.id,
                    card_number: cardNumber,
                    expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 5))
                }
            });

            // 5. Deduct Wallet
            const newBalance = wallet.balance.toNumber() - fee;
            await tx.agentWallet.update({
                where: { agent_id: agentId },
                data: {
                    balance: newBalance,
                    total_spent: wallet.total_spent.toNumber() + fee
                }
            });

            // 6. Record Transaction
            await tx.agentTransaction.create({
                data: {
                    agent_id: agentId,
                    transaction_type: "debit",
                    amount: fee,
                    description: `User Registration: ${mobile}`,
                    reference_type: "user_registration",
                    reference_id: newUser.id,
                    balance_before: wallet.balance,
                    balance_after: newBalance
                }
            });

            // 7. Record AgentCreatedUser
            await tx.agentCreatedUser.create({
                data: {
                    agent_id: agentId,
                    user_id: newUser.id,
                    health_card_id: card.id,
                    commission_amount: 0 // Fee is deducted, commission logic might be separate or 0 if pure deduction
                }
            });

            return { user: newUser, card, remainingBalance: newBalance };
        });

        return sendSuccessResponse(res, { data: result, status: 201 });

    } catch (error) {
        return sendErrorResponse(res, { message: "Failed to create user", status: 500, error: (error as any).message });
    }
});

// Get Agent Users
AgentRouter.get("/users", async (req, res) => {
    try {
        const agentId = (req as any).partner.id;
        const { page = "1", limit = "10", search } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const where: any = { agent_id: agentId };
        if (search) {
            where.user = {
                OR: [
                    { first_name: { contains: search as string, mode: 'insensitive' } },
                    // mobile is unique, direct search
                    { mobile: { contains: search as string } }
                ]
            };
        }

        const total = await prisma.agentCreatedUser.count({ where });
        const users = await prisma.agentCreatedUser.findMany({
            where,
            include: {
                user: { // Relation to User model
                    select: {
                        id: true, first_name: true, last_name: true, mobile: true, email: true, createdAt: true
                    }
                },
                // health card relation if implemented? I didn't add relation in schema for health_card_id to BonchiCard model in AgentCreatedUser
                // Schema has `health_card_id String?`. I should have added relation but for now just returning the ID is fine or fetch separately.
                // Ideally I should update proper relation.
            },
            skip, take,
            orderBy: { created_at: "desc" }
        });

        // Flatten result for frontend convenience
        const flattened = users.map(u => ({
            ...u,
            first_name: u.user.first_name,
            last_name: u.user.last_name,
            mobile: u.user.mobile,
            email: u.user.email,
            // health_card_status?
        }));

        return sendSuccessResponse(res, {
            data: {
                users: flattened,
                pagination: { total, take, skip }
            }
        });

    } catch (error) {
        return sendErrorResponse(res, { message: "Failed to fetch users", status: 500 });
    }
});

// Download Health Card (HTML View)
AgentRouter.get("/download-card/:userId", async (req, res) => {
    try {
        const agentId = (req as any).partner.id;
        const { userId } = req.params;

        // Verify user belongs to agent
        const link = await prisma.agentCreatedUser.findFirst({
            where: { agent_id: agentId, user_id: userId }
        });

        if (!link) {
            return sendErrorResponse(res, { message: "User not found or not authorized.", status: 403 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                bonchi_cards: {
                    where: { id: link.health_card_id || undefined } // If link has specific card ID
                }
            }
        });

        if (!user || !user.bonchi_cards[0]) {
            return sendErrorResponse(res, { message: "Card not found.", status: 404 });
        }

        const card = user.bonchi_cards[0];

        // Generate HTML (Reusing logic from old codebase with updated styles if needed)
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Health Card - ${card.card_number}</title>
  <style>
    body { font-family: sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
    .card-container { width: 400px; height: 250px; background: linear-gradient(135deg, #1d57a9, #2563eb); border-radius: 16px; color: white; padding: 20px; position: relative; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
    .card-header { display: flex; justify-content: space-between; align-items: start; }
    .logo { font-size: 24px; font-weight: bold; opacity: 0.9; }
    .card-title { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; }
    .card-body { margin-top: 40px; }
    .card-number { font-size: 22px; letter-spacing: 4px; font-family: monospace; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    .card-footer { display: flex; justify-content: space-between; margin-top: 30px; font-size: 12px; }
    .label { font-size: 9px; opacity: 0.7; text-transform: uppercase; margin-bottom: 2px; }
    .value { font-weight: 600; }
    .print-btn { position: fixed; top: 20px; right: 20px; padding: 10px 20px; background: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    @media print { .print-btn { display: none; } body { background: white; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Print Card</button>
  <div class="card-container">
    <div class="card-header">
       <div>
          <div class="logo">Bonchi</div>
          <div class="card-title">Health Card</div>
       </div>
       <div style="font-size: 30px; opacity: 0.2;">🏥</div>
    </div>
    <div class="card-body">
       <div class="label">Card Number</div>
       <div class="card-number">${card.card_number}</div>
    </div>
    <div class="card-footer">
       <div>
          <div class="label">Member Name</div>
          <div class="value">${user.first_name} ${user.last_name}</div>
       </div>
       <div style="text-align: right;">
          <div class="label">Valid Thru</div>
          <div class="value">${new Date(card.expiry_date).toLocaleDateString()}</div>
       </div>
    </div>
  </div>
</body>
</html>
        `;

        // Send HTML directly
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);

    } catch (error) {
        return sendErrorResponse(res, { message: "Failed to download card", status: 500 });
    }
});

export default AgentRouter;
