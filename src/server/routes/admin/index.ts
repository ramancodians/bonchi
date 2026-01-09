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

import prisma from "../../db";
import { sendSuccessResponse, sendErrorResponse } from "../../utils/responseUtil";

AdminRouter.get("/stats", async (req, res) => {
    try {
        const totalCustomers = await prisma.user.count({ where: { role: 'USER' } });
        const totalPartners = await prisma.bonchiPartner.count();
        const totalSupportRequests = await prisma.operationSupportForm.count();

        sendSuccessResponse(res, {
            data: {
                totalCustomers,
                totalPartners,
                totalSupportRequests
            }
        });
    } catch (error) {
        console.error("Stats fetching error:", error);
        sendErrorResponse(res, {
            message: "Failed to fetch stats",
            status: 500
        });
    }
});

export default AdminRouter;
