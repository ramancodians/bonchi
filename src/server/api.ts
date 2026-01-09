import { Router } from "express";
import AuthRouter from "./routes/auth/auth";
import SupportRouter from "./routes/support";
import { authMiddleware } from "./middleware/authmiddleware";
import AdminRouter from "./routes/admin";
import { adminMiddleware } from "./middleware/adminMiddleware";

const APIRouter = Router();

APIRouter.use("/auth", AuthRouter);
APIRouter.use("/admin", [adminMiddleware, authMiddleware], AdminRouter);
APIRouter.use("/admin", [adminMiddleware, authMiddleware], AdminRouter);
APIRouter.use("/support", authMiddleware, SupportRouter);

export default APIRouter;
