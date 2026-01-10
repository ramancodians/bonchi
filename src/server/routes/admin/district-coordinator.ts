import { Router } from "express";
import {
    sendErrorResponse,
    sendSuccessResponse,
} from "../../utils/responseUtil";
import { PaginatedResult } from "../../utils/types";
import prisma from "../../db";
import { hashPassword } from "../../utils/securityUtils";
import { UserRoles, AgentStatus } from "@prisma/client";

const DMRouter = Router();

// List DMs
DMRouter.get("/list", async (req, res) => {
    try {
        const { page = "1", limit = "10", search } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const where: any = { role: UserRoles.DISTRICT_CORDINATOR };
        if (search) {
            where.OR = [
                { first_name: { contains: search as string, mode: "insensitive" } },
                { district: { contains: search as string, mode: "insensitive" } }
            ];
        }

        const total = await prisma.user.count({ where });
        const dms = await prisma.user.findMany({
            where, skip, take,
            select: {
                id: true, first_name: true, last_name: true, mobile: true, email: true, district: true,
                district_coordinator: {
                    select: { id: true, assigned_districts: true, employee_id: true, status: true }
                }
            }
        });

        const result: PaginatedResult<(typeof dms)[0]> = {
            items: dms,
            pagination: { total, take, skip }
        };
        return sendSuccessResponse(res, { data: result });
    } catch (e) {
        return sendErrorResponse(res, { message: "Failed to fetch DMs", status: 500 });
    }
});

// Create DM
DMRouter.post("/create", async (req, res) => {
    try {
        const {
            first_name, last_name, email, mobile, password,
            district, // Home district?
            assigned_districts,
            employee_id
        } = req.body;

        if (!first_name || !mobile || !password) return sendErrorResponse(res, { message: "Missing fields", status: 400 });

        const existingUser = await prisma.user.findFirst({ where: { mobile } });
        if (existingUser) {
            return sendErrorResponse(res, { message: "User with this mobile number already exists", status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const result = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    first_name, last_name, email, mobile, password: hashedPassword,
                    role: UserRoles.DISTRICT_CORDINATOR,
                    district: district || (assigned_districts?.[0])
                }
            });

            const dmProfile = await tx.districtCoordinator.create({
                data: {
                    user_id: newUser.id,
                    employee_id,
                    assigned_districts: assigned_districts || []
                }
            });
            return { user: newUser, dm: dmProfile };
        });

        return sendSuccessResponse(res, { data: result, status: 201 });
    } catch (e) {
        return sendErrorResponse(res, { message: "Failed to create DM", status: 500, error: (e as any).message });
    }
});

export default DMRouter;
