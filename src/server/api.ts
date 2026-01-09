import { Router } from "express";
import AuthRouter from "./routes/auth/auth";
import SupportRouter from "./routes/support";
import { authMiddleware } from "./middleware/authmiddleware";
import AdminRouter from "./routes/admin";
import AgentRouter from "./routes/agent";
import DMRouter from "./routes/district-manager";
import { adminMiddleware } from "./middleware/adminMiddleware";

import HealthCardRouter from "./routes/customer/health-card";

const APIRouter = Router();

APIRouter.use("/auth", AuthRouter);
APIRouter.use("/admin", [authMiddleware, adminMiddleware], AdminRouter);
APIRouter.use("/support", authMiddleware, SupportRouter);
APIRouter.use("/agent", authMiddleware, AgentRouter);
APIRouter.use("/district-manager", authMiddleware, DMRouter);
APIRouter.use("/customer/health-card", authMiddleware, HealthCardRouter);

export default APIRouter;
