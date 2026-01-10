import { Router } from "express";
import {
    sendErrorResponse,
    sendSuccessResponse,
} from "../utils/responseUtil";
import { PaginatedResult } from "../utils/types";
import prisma from "../db";
import { HospitalType } from "@prisma/client";

const ListingsRouter = Router();

// List partners for customer view
ListingsRouter.get("/", async (req, res) => {
    try {
        const { page = "1", limit = "10", type, search } = req.query; // type: HOSPITAL, LAB, MEDICAL_STORE

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const where: any = {};

        if (search) {
            where.OR = [
                { first_name: { contains: search as string, mode: "insensitive" } },
                { last_name: { contains: search as string, mode: "insensitive" } },
                {
                    hospital_partner: {
                        hospital_name: { contains: search as string, mode: "insensitive" }
                    }
                },
                {
                    medical_store: {
                        store_name: { contains: search as string, mode: "insensitive" }
                    }
                }
            ];
        }

        if (type === "HOSPITAL") {
            where.role = "HOSPITAL_PARTNER";
            // Optionally exclude Diagnostic Centres if strict, but maybe okay to include all
        } else if (type === "LAB") {
            where.role = "HOSPITAL_PARTNER";
            where.hospital_partner = {
                hospital_types: {
                    has: "DIAGNOSTIC_CENTRE"
                }
            };
        } else if (type === "MEDICAL_STORE") {
            where.role = "MEDICAL_STORE";
        }

        const total = await prisma.user.count({ where });

        const users = await prisma.user.findMany({
            where,
            skip,
            take,
            select: {
                id: true,
                first_name: true,
                last_name: true,
                role: true,
                hospital_partner: {
                    select: {
                        id: true,
                        hospital_name: true,
                        hospital_types: true,
                        medical_services: true,
                        contact_person_name: true,
                        mobile_number: true,
                        full_address: true,
                        addresses: {
                            select: {
                                district: true,
                                state: true,
                            },
                            take: 1,
                        },
                    },
                },
                medical_store: {
                    select: {
                        id: true,
                        store_name: true,
                        owner_name: true,
                        mobile_number: true,
                        full_address: true,
                        addresses: {
                            select: {
                                district: true,
                                state: true,
                            },
                            take: 1,
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const result: PaginatedResult<(typeof users)[0]> = {
            items: users,
            pagination: {
                total,
                take,
                skip,
            },
        };

        return sendSuccessResponse(res, { data: result });
    } catch (error) {
        console.error("Error fetching listings:", error);
        return sendErrorResponse(res, {
            message: "Failed to fetch listings",
            status: 500,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default ListingsRouter;
