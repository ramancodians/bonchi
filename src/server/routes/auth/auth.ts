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
import { authMiddleware } from "../../middleware/authmiddleware";

const AuthRouter = Router();

AuthRouter.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Validate input
    if (!emailOrPhone || !password) {
      return sendErrorResponse(res, {
        message: "Email/Phone and password are required",
        status: 400,
      });
    }

    // Determine if input is email or phone
    const isPhone = /^[6-9]\d{9}$/.test(emailOrPhone);

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: isPhone
        ? { mobile: emailOrPhone }
        : { email: emailOrPhone.toLowerCase() },
    });

    if (!user) {
      return sendErrorResponse(res, {
        message: "Invalid email/phone or password",
        status: 401,
      });
    }

    // Verify password
    if (!user.password) {
      return sendErrorResponse(res, {
        message: "Invalid email or password",
        status: 401,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendErrorResponse(res, {
        message: "Invalid email or password",
        status: 401,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    sendSuccessResponse(res, {
      data: {
        message: "Login successful",
        user: userWithoutPassword,
        token,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    sendErrorResponse(res, {
      message: "An error occurred during sign-in",
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

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
    const { password, confirm_password, ...userDataWithoutPassword } =
      validatedData;

    // TODO: Save user to database
    const user = await prisma.user.create({
      data: {
        ...userDataWithoutPassword,
        ...(hashedPassword && { password: hashedPassword }),
        gender: "OTHER", // Default gender
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

AuthRouter.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.userInfo.id,
      },
    });
    if (!user) {
      return sendErrorResponse(res, {
        message: "User not found",
        status: 404,
      });
    }

    sendSuccessResponse(res, {
      data: user,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    sendErrorResponse(res, {
      message: "An error occurred while fetching user profile",
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default AuthRouter;
