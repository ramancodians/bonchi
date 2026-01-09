import { Router } from "express";
import prisma from "../db";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responseUtil";

const BannerRouter = Router();

// Middleware to check for Admin (optional, or applied in api.ts)
// For now, I'll rely on the caller to protect admin routes or check role here.

// GET All Active Banners (Public/Customer)
BannerRouter.get("/public", async (req, res) => {
    try {
        const banners = await prisma.bannerImage.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }, // or created_at desc
        });
        sendSuccessResponse(res, { data: banners });
    } catch (error) {
        sendErrorResponse(res, { message: "Failed to fetch banners", status: 500 });
    }
});

// Admin: Upload Banner
BannerRouter.post("/upload", async (req, res) => {
    try {
        // Auth check manually for now if not wrapped
        // if ((req as any).userInfo?.role !== 'SUPER_ADMIN') return 403...
        // Assuming this route is mounted under a protected path or we check here.
        // Let's assume protected by authMiddleware but need to check role.support

        const { imageBase64 } = req.body;
        if (!imageBase64) {
            return sendErrorResponse(res, { message: "No image provided", status: 400 });
        }

        const banner = await prisma.bannerImage.create({
            data: {
                url: imageBase64,
                isActive: true
            }
        });

        sendSuccessResponse(res, { message: "Banner uploaded", data: banner });
    } catch (error) {
        console.error("Upload error:", error);
        sendErrorResponse(res, { message: "Upload failed", status: 500 });
    }
});

// Admin: Delete Banner
BannerRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.bannerImage.delete({ where: { id } });
        sendSuccessResponse(res, { message: "Banner deleted" });
    } catch (error) {
        sendErrorResponse(res, { message: "Delete failed", status: 500 });
    }
});

export default BannerRouter;
