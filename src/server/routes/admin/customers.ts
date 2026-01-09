import { Router } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "./../../utils/responseUtil";
import { PaginatedResult } from "./../../utils/types";
import prisma from "../../db";

const CustomersRouter = Router();

CustomersRouter.get("/list", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get total count of users
    const total = await prisma.user.count({ where: { role: 'CUSTOMER' } });

    // Get paginated users (exclude password)
    const users = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        first_name: true,
        last_name: true,
        email: true,
        guardian_name: true,
        gender: true,
        age: true,
        mobile: true,
        dob: true,
        village: true,
        block: true,
        district: true,
        state: true,
        pincode: true,
        ayushmanCardAvailable: true,
        customerConsent: true,
        termsAccepted: true,
      },
    });

    const result: PaginatedResult<typeof users[0]> = {
      items: users,
      pagination: {
        total,
        take: limit,
        skip,
      },
    };

    sendSuccessResponse(res, {
      data: result,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    sendErrorResponse(res, {
      message: "An error occurred while fetching customers",
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

CustomersRouter.get("/search", async (req, res) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!query) {
      return sendErrorResponse(res, {
        message: "Search query is required",
        status: 400,
      });
    }

    // Build search conditions
    const searchConditions = {
      role: 'CUSTOMER',
      OR: [
        { first_name: { contains: query, mode: "insensitive" as const } },
        { last_name: { contains: query, mode: "insensitive" as const } },
        { email: { contains: query, mode: "insensitive" as const } },
        { mobile: { contains: query } },
        { village: { contains: query, mode: "insensitive" as const } },
        { district: { contains: query, mode: "insensitive" as const } },
      ],
    };

    // Get total count matching search
    const total = await prisma.user.count({
      where: searchConditions,
    });

    // Get paginated search results
    const users = await prisma.user.findMany({
      where: searchConditions,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        first_name: true,
        last_name: true,
        email: true,
        guardian_name: true,
        gender: true,
        age: true,
        mobile: true,
        dob: true,
        village: true,
        block: true,
        district: true,
        state: true,
        pincode: true,
        ayushmanCardAvailable: true,
        customerConsent: true,
        termsAccepted: true,
      },
    });

    const result: PaginatedResult<typeof users[0]> = {
      items: users,
      pagination: {
        total,
        take: limit,
        skip,
      },
    };

    sendSuccessResponse(res, {
      data: result,
      status: 200,
    });
  } catch (error) {
    console.error("Error searching customers:", error);
    sendErrorResponse(res, {
      message: "An error occurred while searching customers",
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
})

export default CustomersRouter;
