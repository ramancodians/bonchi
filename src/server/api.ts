import { Router } from "express";
import AuthRouter from "./routes/auth/auth";
import SupportRouter from "./routes/support";
import { authMiddleware } from "./middleware/authmiddleware";

const APIRouter = Router();

APIRouter.use("/auth", AuthRouter);
APIRouter.use("/support", authMiddleware, SupportRouter);

export default APIRouter;
