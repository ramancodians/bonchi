import { Router } from "express";

import prisma from "../../db";
import { hashPassword } from "../../utils/securityUtils";

const RunRouter = Router();

RunRouter.get("/", async (req, res) => {
  try {
    const hashedPassword = await hashPassword("test1234");
    const user = await prisma.user.create({
      data: {
        first_name: "Raman",
        last_name: "Choudhary",
        role: "SUPER_ADMIN",
        email: "raman@bonchicares.in",
        password: hashedPassword,
        mobile: "9632725300",
      },
    });
    res.status(201).json({ data: user });
  } catch (error) {
    console.error("Run error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default RunRouter;
