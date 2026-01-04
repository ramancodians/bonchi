/*
 Auth routes
*/

import { Router } from "express";
import jwt from "jsonwebtoken";
import { registerUserSchema } from "./types";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/responseUtil";
import { z } from "zod";
import prisma from "../../db";
import bcrypt from "bcrypt";

const AuthRouter = Router();

AuthRouter.post("/sign-in", async (req, res) => {});

AuthRouter.post("/register", async (req, res) => {
  try {
    // Validate request body with Zod
    const validatedData = registerUserSchema.parse(req.body);

    // Check if user already exists in the database
    const { mobile } = validatedData;
    const existingUser = await prisma.user.findFirst({
      where: {
        mobile,
      },
    });

    if (existingUser) {
      return sendErrorResponse(res, {
        message: "User with this mobile number already exists",
        status: 409,
      });
    }

    // Hash the password if provided
    let hashedPassword: string | undefined;
    if (validatedData.password) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
      hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);
    }

    // Create user with hashed password
    const { password, ...userDataWithoutPassword } = validatedData;

    // TODO: Save user to database
    const user = await prisma.user.create({
      data: {
        ...userDataWithoutPassword,
        gender: userDataWithoutPassword.gender.toUpperCase() as
          | "MALE"
          | "FEMALE"
          | "OTHER",
        ayushmanCardAvailable:
          userDataWithoutPassword.ayushmanCardAvailable.toUpperCase() as
            | "YES"
            | "NO",
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    // Auth token
    const token = jwt.sign(
      { userId: user.id, mobile: user.mobile },
      process.env.JWT_SECRET || "default_secret"
    );

    // For now, return success with validated data
    sendSuccessResponse(res, {
      data: {
        message: "User registered successfully",
        user,
        token,
      },
      status: 201,
    });
  } catch (error) {
    // Handle Zod validation errors
    console.log("Error caught in registration route:", error);
    if (error instanceof z.ZodError) {
      return sendErrorResponse(res, {
        message: "Validation failed!!!",
        status: 400,
        data: error.errors,
      });
    }

    // Handle other errors
    console.error("Registration error:", error);
    sendErrorResponse(res, {
      message: "An error occurred during registration",
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default AuthRouter;
