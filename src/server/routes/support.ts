import { Router } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "./../utils/responseUtil";
import prisma from "../db";

const SupportRouter = Router();

SupportRouter.post("/create", async (req, res) => {
  try {
    console.log("Request Body:", req.userInfo);
    const newSupport = await prisma.operationSupportForm.create({
      data: {
        user_id: req.userInfo.userId,
        ...req.body,
      },
    });

    sendSuccessResponse(res, {
      data: newSupport,
    });
  } catch (error) {
    console.error("Support request creation error:", error);
    sendErrorResponse(res, {
      message: "Failed to create support request",
      status: 500,
    });
  }
});

SupportRouter.get("/list", async (req, res) => {
  try {
    const role = (req as any).userInfo.role;
    const userId = (req as any).userInfo.userId;

    let whereClause = {};

    // If NOT admin, restrict to own requests
    if (role !== "SUPER_ADMIN") {
      whereClause = { user_id: userId };
    }

    const supportList = await prisma.operationSupportForm.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            mobile: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    sendSuccessResponse(res, {
      data: supportList,
    });
  } catch (error) {
    console.error("Support request listing error:", error);
    sendErrorResponse(res, {
      message: "Failed to fetch support requests",
      status: 500,
    });
  }
});

SupportRouter.put("/update/:id", async (req, res) => {
  try {
    const supportId = req.params.id;
    const updatedSupport = await prisma.operationSupportForm.update({
      where: { id: supportId },
      data: {
        ...req.body,
      },
    });
    sendSuccessResponse(res, {
      data: updatedSupport,
    });
  } catch (error) {
    console.error("Support request update error:", error);
    sendErrorResponse(res, {
      message: "Failed to update support request",
      status: 500,
    });
  }
});

SupportRouter.get("/item/:id", async (req, res) => {
  try {
    const supportId = req.params.id;
    const supportItem = await prisma.operationSupportForm.findFirst({
      where: { id: supportId },
    });
    sendSuccessResponse(res, {
      data: supportItem,
    });
  } catch (error) {
    console.error("Support request deletion error:", error);
    sendErrorResponse(res, {
      message: "Failed to delete support request",
      status: 500,
    });
  }
});
export default SupportRouter;
