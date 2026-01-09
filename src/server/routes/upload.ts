import { Router } from "express";
import { uploadMiddleWare } from "../middleware/fileUpload";

const UploadRouter = Router();

UploadRouter.post("/", uploadMiddleWare.single("file"), async (req, res) => {});

export default UploadRouter;
