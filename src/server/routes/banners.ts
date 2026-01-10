import { Router } from "express";
import prisma from "../db";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responseUtil";
import { adminMiddleware } from "../middleware/adminMiddleware";

const BannerRouter = Router();

BannerRouter.get("/", async (req, res) => {
  try {
    const banners = await prisma.bannerItems.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return sendSuccessResponse(res, { data: banners });
  } catch (error) {
    return sendErrorResponse(res, {
      message: "Failed to retrieve banners",
      status: 500,
    });
  }
});

BannerRouter.post("/", adminMiddleware, async (req, res) => {
  try {
    const { title, imageUrl, linkUrl, isActive, order } = req.body;

    // Validate required fields
    if (!title || !imageUrl) {
      return sendErrorResponse(res, {
        message: "Title and imageUrl are required",
        status: 400,
      });
    }

    const newBanner = await prisma.bannerItems.create({
      data: {
        title,
        imageUrl,
        linkUrl: linkUrl || null,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
      },
    });

    return sendSuccessResponse(res, { data: newBanner, status: 201 });
  } catch (error) {
    return sendErrorResponse(res, {
      message: "Failed to create banner",
      status: 500,
    });
  }
});

BannerRouter.put("/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, imageUrl, linkUrl, isActive, order } = req.body;

    // Check if banner exists
    const existingBanner = await prisma.bannerItems.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return sendErrorResponse(res, {
        message: "Banner not found",
        status: 404,
      });
    }

    const updatedBanner = await prisma.bannerItems.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(imageUrl && { imageUrl }),
        ...(linkUrl !== undefined && { linkUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
      },
    });

    return sendSuccessResponse(res, { data: updatedBanner });
  } catch (error) {
    return sendErrorResponse(res, {
      message: "Failed to update banner",
      status: 500,
    });
  }
});

BannerRouter.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if banner exists
    const existingBanner = await prisma.bannerItems.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return sendErrorResponse(res, {
        message: "Banner not found",
        status: 404,
      });
    }

    await prisma.bannerItems.delete({
      where: { id },
    });

    return sendSuccessResponse(res, { data: null });
  } catch (error) {
    return sendErrorResponse(res, {
      message: "Failed to delete banner",
      status: 500,
    });
  }
});

export default BannerRouter;
