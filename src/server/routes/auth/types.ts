import { z } from "zod";

// Registration validation schema
export const registerUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  guardianName: z
    .string()
    .min(2, "Guardian name must be at least 2 characters")
    .max(100, "Guardian name must be less than 100 characters"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Gender must be male, female, or other" }),
  }),
  age: z
    .number()
    .int("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .optional(),
  village: z
    .string()
    .min(2, "Village name must be at least 2 characters")
    .max(100, "Village name must be less than 100 characters"),
  block: z
    .string()
    .min(1, "Block is required")
    .max(100, "Block name must be less than 100 characters"),
  district: z
    .string()
    .min(1, "District is required")
    .max(100, "District name must be less than 100 characters"),
  state: z
    .string()
    .min(1, "State is required")
    .max(100, "State name must be less than 100 characters"),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be 6 digits")
    .optional()
    .or(z.literal("")),
  ayushmanCardAvailable: z.enum(["yes", "no"], {
    errorMap: () => ({ message: "Please select Ayushman card status" }),
  }),
  illness: z
    .string()
    .max(500, "Illness description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  customerConsent: z.boolean().refine((val) => val === true, {
    message: "Customer consent is required",
  }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and disclaimer",
  }),
});

// Type inference from schema
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
