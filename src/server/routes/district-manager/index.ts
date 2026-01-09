import { Router } from "express";
import {
    sendErrorResponse,
    sendSuccessResponse,
} from "../../utils/responseUtil";
import prisma from "../../db";
import { hashPassword } from "../../utils/securityUtils";
import { UserRoles } from "@prisma/client";

const DMRouter = Router();

// Middleware
const ensureDM = async (req: any, res: any, next: any) => {
    if (req.userInfo?.role !== "DISTRICT_CORDINATOR") {
        return sendErrorResponse(res, { message: "Access denied. District Managers only.", status: 403 });
    }
    const dm = await prisma.districtCoordinator.findUnique({ where: { user_id: req.userInfo.userId } });
    if (!dm) return sendErrorResponse(res, { message: "DM profile not found.", status: 404 });
    req.dm = dm;
    next();
};

DMRouter.use(ensureDM);

// Dashboard Stats
DMRouter.get("/dashboard", async (req, res) => {
    try {
        const districts = (req as any).dm.assigned_districts;

        // Count Agents in districts
        // Agents are User(role=BONCHI_MITRA) + BonchiMitraPartner(addresses.district in districts?)
        // Or simpler: User.district in districts AND role=BONCHI_MITRA

        const totalAgents = await prisma.user.count({
            where: {
                role: "BONCHI_MITRA",
                district: { in: districts, mode: 'insensitive' }
            }
        });

        const activeAgents = await prisma.user.count({
            where: {
                role: "BONCHI_MITRA",
                district: { in: districts, mode: 'insensitive' },
                bonchi_mitra_partner: {
                    agent_status: "ACTIVE"
                }
            }
        });

        // Recent Agents
        const recentAgents = await prisma.user.findMany({
            where: {
                role: "BONCHI_MITRA",
                district: { in: districts, mode: 'insensitive' }
            },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, first_name: true, last_name: true, district: true, createdAt: true }
        });

        return sendSuccessResponse(res, {
            data: {
                stats: { totalAgents, activeAgents, districtsCount: districts.length, assignedDistricts: districts },
                recentAgents
            }
        });

    } catch (e) {
        return sendErrorResponse(res, { message: "Failed to fetch dashboard", status: 500 });
    }
});

// List Agents
DMRouter.get("/agents", async (req, res) => {
    try {
        const districts = (req as any).dm.assigned_districts;
        const { page = "1", limit = "10", search } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const where: any = {
            role: "BONCHI_MITRA",
            district: { in: districts, mode: 'insensitive' }
        };

        if (search) {
            where.OR = [
                { first_name: { contains: search as string, mode: 'insensitive' } },
                { mobile: { contains: search as string } }
            ];
        }

        const total = await prisma.user.count({ where });
        const agents = await prisma.user.findMany({
            where,
            select: {
                id: true, first_name: true, last_name: true, mobile: true, email: true, district: true, createdAt: true,
                bonchi_mitra_partner: {
                    select: { agent_code: true, agent_status: true, wallet: { select: { balance: true } } }
                }
            },
            skip, take,
            orderBy: { createdAt: "desc" }
        });

        return sendSuccessResponse(res, { data: { agents, pagination: { total, take, skip } } });

    } catch (e) {
        return sendErrorResponse(res, { message: "Failed to fetch agents", status: 500 });
    }
});

// Create Agent (Restricted to DM's districts)
DMRouter.post("/create-agent", async (req, res) => {
    try {
        const districts = (req as any).dm.assigned_districts;
        const {
            first_name, last_name, email, mobile, password,
            district, state, block, pincode, full_address,
            shop_centre_name
        } = req.body;

        if (!districts.includes(district)) {
            return sendErrorResponse(res, { message: `You are not authorized to create agents in ${district}`, status: 403 });
        }

        // Check exists
        const existing = await prisma.user.findUnique({ where: { mobile } });
        if (existing) return sendErrorResponse(res, { message: "User exists", status: 409 });

        const hashedPassword = await hashPassword(password);

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    first_name, last_name, email, mobile, password: hashedPassword,
                    role: "BONCHI_MITRA",
                    district, state, block, pincode
                }
            });

            const agentCode = `BON-AGT-${Math.floor(1000 + Math.random() * 9000)}`;
            const partner = await tx.bonchiMitraPartner.create({
                data: {
                    user_id: user.id,
                    agent_code: agentCode,
                    shop_centre_name: shop_centre_name || "Shop",
                    // Minimal required fields
                    aadhaar_number: "NA", pan_number: "NA",
                    bank_account_holder_name: first_name, bank_account_number: "0", bank_ifsc_code: "0", bank_name: "0",
                    reporting_district_manager: (req as any).userInfo.userId, // Linked to this DM
                    addresses: {
                        create: { full_address: full_address || district, district, state, block, pincode }
                    }
                }
            });

            await tx.agentWallet.create({ data: { agent_id: partner.id, balance: 0 } });
            return user;
        });

        return sendSuccessResponse(res, { data: result, status: 201 });

    } catch (e) {
        return sendErrorResponse(res, { message: "Failed to create agent", status: 500, error: (e as any).message });
    }
});

export default DMRouter;
