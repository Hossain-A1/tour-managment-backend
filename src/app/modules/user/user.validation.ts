import z from "zod";
import { IsActive, Role } from "./user.interface";
//create user zodSchema
export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name too short. Minimum 2 character long" })
    .max(50, { message: "Name too long" }),

  email: z
    .string({
      invalid_type_error: "Email must be a string.",
    })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(50, { message: "Email must not exceed 100 characters." })
    .email({ message: "Invalid email address format." }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/\d/, { message: "Password must contain at least one number." })
    .regex(/[!@#$%^&*(),.?":]/, {
      message:
        'Password must contain at least one special character (!@#$%^&*(),.?":)',
    }),
  phone: z
    .string({
      invalid_type_error: "Phone number must be a string.",
    })
    .regex(/^(\+8801|8801|01)[0-9]{9}$/, {
      message:
        "Phone number must be a valid Bangladeshi number (e.g. 01XXXXXXXXX, 8801XXXXXXXXX, or +8801XXXXXXXXX).",
    })
    .optional(),
  address: z
    .string({ message: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters" })
    .optional(),
});

//update user zod Schema
export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name too short. Minimum 2 character long" })
    .max(50, { message: "Name too long" })
    .optional(),



  phone: z
    .string({
      invalid_type_error: "Phone number must be a string.",
    })
    .regex(/^(\+8801|8801|01)[0-9]{9}$/, {
      message:
        "Phone number must be a valid Bangladeshi number (e.g. 01XXXXXXXXX, 8801XXXXXXXXX, or +8801XXXXXXXXX).",
    })
    .optional(),
  address: z
    .string({ message: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters" })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z
    .boolean({ invalid_type_error: "isDeleted must true or false" })
    .optional(),
  isVerified: z
    .boolean({ invalid_type_error: "isVerifed must true or false" })
    .optional(),
});
