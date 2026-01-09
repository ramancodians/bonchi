import { Router } from "express";
import RunRouter from "./run";
import CustomersRouter from "./customers";
import PartnersRouter from "./partners";
import BonchiMitraRouter from "./bonchi-mitra";
import DMRouter from "./district-coordinator";

const AdminRouter = Router();

AdminRouter.use("/run", RunRouter);
AdminRouter.use("/customers", CustomersRouter);
AdminRouter.use("/partners", PartnersRouter);
AdminRouter.use("/bonchi-mitra", BonchiMitraRouter);
AdminRouter.use("/district-coordinators", DMRouter);

export default AdminRouter;
