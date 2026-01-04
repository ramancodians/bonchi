import { Router } from "express";
import AuthRouter from "./routes/auth/auth";

const APIRouter = Router();

APIRouter.use("/auth", AuthRouter);

export default APIRouter;
