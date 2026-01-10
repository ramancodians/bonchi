import { Router } from "express";

import prisma from "../../db";
import { hashPassword } from "../../utils/securityUtils";

const RunRouter = Router();

RunRouter.get("/", async (req, res) => {
  try {
    const hashedPassword = await hashPassword("superadmin1234");
    const user = await prisma.user.create({
      data: {
        first_name: "Super",
        last_name: "Admin",
        role: "SUPER_ADMIN",
        email: "super_admin@gmail.com",
        password: hashedPassword,
        mobile: "9632725310",
      },
    });
    res.status(201).json({ data: user });
  } catch (error) {
    console.error("Run error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default RunRouter;
