import { Router } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responseUtil";
import { uploadMiddleWare } from "../middleware/fileUpload";
import prisma from "../db";

const UploadRouter = Router();

UploadRouter.post("/", uploadMiddleWare.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const uploadedFile = await prisma.fileUpload.create({
      data: {
        fileName: req.file.filename,
        fileUrl: req.file.path,
        uploadedBy: (req as any).userInfo.id,
        fileType: req.file.mimetype,
      },
    });
    return sendSuccessResponse(res, { data: uploadedFile });
  } catch (error) {
    console.error("File upload error:", error);
    return sendErrorResponse(res, {
      message: "File upload failed",
      status: 500,
    });
  }
});

export default UploadRouter;
