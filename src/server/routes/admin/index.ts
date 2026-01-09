import { Router } from "express";
import RunRouter from "./run";
import CustomersRouter from "./customers";
import PartnersRouter from "./partners";

const AdminRouter = Router();

AdminRouter.use("/run", RunRouter);
AdminRouter.use("/customers", CustomersRouter);
AdminRouter.use("/partners", PartnersRouter);

export default AdminRouter;
