import { z } from "zod";

// Registration validation schema
export const registerUserSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(100, "First name must be less than 100 characters"),
    last_name: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(100, "Last name must be less than 100 characters"),
    email: z
      .string()
      .email("Invalid email address")
      .max(255, "Email must be less than 255 characters"),
    mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be less than 100 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

// Type inference from schema
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
