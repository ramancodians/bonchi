import { Router } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseUtil";
import { PaginatedResult } from "../../utils/types";
import prisma from "../../db";
import { hashPassword } from "../../utils/securityUtils";
import { UserRoles, AgentStatus } from "@prisma/client";

const BonchiMitraRouter = Router();

// List Bonchi Mitras
BonchiMitraRouter.get("/list", async (req, res) => {
  try {
    const { page = "1", limit = "10", search, status, district } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};

    if (search) {
      where.OR = [
        { first_name: { contains: search as string, mode: "insensitive" } },
        { last_name: { contains: search as string, mode: "insensitive" } },
        { mobile: { contains: search as string } },
        { email: { contains: search as string, mode: "insensitive" } },
        { bonchi_mitra_partner: { agent_code: { contains: search as string } } }
      ];
    }
    
    // Filter by User Role but also join with BonchiMitraPartner
    where.role = "BONCHI_MITRA";

    if (status) {
        where.bonchi_mitra_partner = { ...where.bonchi_mitra_partner, agent_status: status };
    }
    if (district) {
         // District is on User or Partner address?
         // User has district field, Partner has addresses. Let's use User's district or Partner address.
         // bonchi schema user has district.
         where.district = { contains: district as string, mode: 'insensitive' };
    }

    const total = await prisma.user.count({ where });

    const agents = await prisma.user.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        mobile: true,
        email: true,
        district: true,
        createdAt: true,
        bonchi_mitra_partner: {
          select: {
            id: true,
            agent_code: true,
            agent_status: true,
            kyc_status: true,
            wallet: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    const result: PaginatedResult<(typeof agents)[0]> = {
      items: agents,
      pagination: {
        total,
        take,
        skip,
      },
    };

    return sendSuccessResponse(res, { data: result });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return sendErrorResponse(res, {
      message: "Failed to fetch agents",
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create Bonchi Mitra (Agent)
BonchiMitraRouter.post("/create", async (req, res) => {
    try {
        const {
            // User Basic
            first_name, last_name, email, mobile, password,
            // Address
            district, state, block, pincode, full_address,
            // Partner Specific
            aadhaar_number, pan_number, 
            shop_centre_name, business_types,
            bank_account_holder_name, bank_account_number, bank_ifsc_code, bank_name
        } = req.body;

        if (!first_name || !mobile || !password || !district) {
             return sendErrorResponse(res, { message: "Missing required basic fields", status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { mobile } });
        if (existingUser) {
            return sendErrorResponse(res, { message: "User with mobile already exists", status: 409 });
        }

        const hashedPassword = await hashPassword(password);
        const createdByUserId = (req as any).user?.id;

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create User
            const newUser = await tx.user.create({
                data: {
                    first_name, last_name, email, mobile, password: hashedPassword,
                    role: UserRoles.BONCHI_MITRA,
                    district, state, block, pincode,
                    // If full_address is provided we might want to stash it or create AddressBook entry immediately
                    // But schema user doesn't have address field except component fields.
                }
            });

            // 2. Generate Agent Code
            // Simple logic: BON-AGT-{RANDOM} or ID-based if possible. Let's use Random for now to avoid locking
            const agentCode = `BON-AGT-${Math.floor(1000 + Math.random() * 9000)}`;

            // 3. Create BondhiMitraPartner
            const partner = await tx.bonchiMitraPartner.create({
                data: {
                    user_id: newUser.id,
                    created_by_user_id: createdByUserId,
                    aadhaar_number: aadhaar_number || `DUMMY-AD-${Date.now()}`, // Temporary fallback if not provided, but should be required
                    pan_number: pan_number || `DUMMY-PAN-${Date.now()}`,
                    shop_centre_name: shop_centre_name || "Home Office",
                    business_types: business_types || [],
                    
                    bank_account_holder_name: bank_account_holder_name || first_name,
                    bank_account_number: bank_account_number || "0000000000",
                    bank_ifsc_code: bank_ifsc_code || "BANK0000000",
                    bank_name: bank_name || "Bank",
                    
                    agent_code: agentCode,
                    agent_status: AgentStatus.ACTIVE,
                    kyc_status: "VERIFIED", // Admin created, so auto-verify? or PENDING
                    
                    // Link address?
                    addresses: {
                        create: {
                            full_address: full_address || `${district}, ${state}`,
                            district, state, block, pincode
                        }
                    }
                }
            });

            // 4. Create Wallet
            await tx.agentWallet.create({
                data: {
                    agent_id: partner.id, 
                    balance: 0
                }
            });

            return { user: newUser, partner };
        });

        return sendSuccessResponse(res, { data: result, status: 201 });

    } catch (error) {
        console.error("Create Agent Error:", error);
        return sendErrorResponse(res, { message: "Failed to create agent", status: 500, error: (error as any).message });
    }
});

// Get Agent Wallet
BonchiMitraRouter.get("/:agentId/wallet", async (req, res) => {
    try {
        const { agentId } = req.params;
        // agentId here is likely the USER ID or PARTNER ID from frontend?
        // Let's assume frontend sends Partner ID (which is distinct from User ID in my schema logic currently)
        // Or if I list by User ID, I need to find Partner ID.
        // My list API returns User with nested Partner.
        // If frontend passes Partner ID:
        const wallet = await prisma.agentWallet.findUnique({
            where: { agent_id: agentId } // agent_id field in Wallet is FK to Partner ID
        });

        if(!wallet) return sendErrorResponse(res, { message: "Wallet not found", status: 404 });
        
        return sendSuccessResponse(res, { data: wallet });
    } catch (error) {
        return sendErrorResponse(res, { message: "Error fetching wallet", status: 500 });
    }
});

// Add Money to Wallet
BonchiMitraRouter.post("/wallet/add-money", async (req, res) => {
    try {
        const { agentId, amount, description } = req.body;
        // agentId is Partner ID
        if(!amount || amount <= 0) return sendErrorResponse(res, { message: "Invalid amount", status: 400 });

        const result = await prisma.$transaction(async (tx) => {
            const wallet = await tx.agentWallet.findUnique({ where: { agent_id: agentId } });
            if(!wallet) throw new Error("Wallet not found");

            const newBalance = wallet.balance.toNumber() + parseFloat(amount);
            
            // Update wallet
            const updatedWallet = await tx.agentWallet.update({
                where: { agent_id: agentId },
                data: { 
                    balance: newBalance,
                    // Typically 'total_earned' implies earnings from commission, 'add money' might be just topup or credit?
                    // Let's just update balance for topup.
                }
            });

            // Create Transaction
            await tx.agentTransaction.create({
                data: {
                    agent_id: agentId,
                    transaction_type: "credit",
                    amount: amount,
                    description: description || "Admin Topup",
                    reference_type: "admin_topup",
                    balance_before: wallet.balance,
                    balance_after: newBalance,
                    performed_by: (req as any).user?.id
                }
            });
            
            return updatedWallet;
        });

        return sendSuccessResponse(res, { data: result });

    } catch (error) {
        return sendErrorResponse(res, { message: "Add money failed", status: 500, error: (error as any).message });
    }
});

export default BonchiMitraRouter;
