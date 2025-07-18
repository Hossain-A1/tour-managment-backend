import z from "zod";

export const createDivisionZodSchema = z.object({
  name: z
    .string({required_error:"Name is required", invalid_type_error: "Division name must be string" })
    .min(4, "Division name must be 3 characters long")
    .max(20, "Division name must be under 20 characters"),
  slug: z.string({required_error:"Slug is required", invalid_type_error: "Slug must be string" }).optional(),
  thambnails: z
    .string({ invalid_type_error: "Thambnails must be string" })
    .optional(),
  description: z
    .string({ invalid_type_error: "Description must be string" })
    .min(15, "Description  must be 15 characters long")
    .optional(),
});

export const updateDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Division name must be string" })
    .min(4, "Division name must be 3 characters long")
    .max(20, "Division name must be under 20 characters")
    .optional(),
  slug: z.string({ invalid_type_error: "Slug must be string" }).optional(),
  thambnails: z
    .string({ invalid_type_error: "Thambnails must be string" })
    .optional(),
  description: z
    .string({ invalid_type_error: "Description must be string" })
    .min(15, "Description  must be 15 characters long")
    .optional(),
});
