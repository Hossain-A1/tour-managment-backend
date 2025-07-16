import z from "zod";

export const createTourTypeZodSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be string",
    })
    .min(5, "Name must be 5 characters long")
    .max(50, "Name must be under 50 characters"),
});

export const updateTourZodSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a text",
    })
    .min(5, "Title should be at least 5 characters long")
    .max(150, "Title should be no more than 150 characters"),

  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a text",
    })
    .min(5, "Slug should be at least 5 characters long")
    .max(150, "Slug should be no more than 150 characters").optional(),

  description: z
    .string({ invalid_type_error: "Description must be a text" })
    .min(20, "Description should be at least 20 characters long")
    .max(200, "Description should be no more than 200 characters")
    .optional(),

  images: z.array(z.string()).optional(),

  location: z
    .string({required_error:"Location is required", invalid_type_error: "Location must be a text" })
    .min(10, "Location should be at least 10 characters long")
    .max(100, "Location should be no more than 100 characters"),
    

  costForm: z
    .number({ invalid_type_error: "Cost must be a number" })
    .min(0, "Cost must be a positive number")
    .optional(),

  startDate: z
    .date({ invalid_type_error: "Start date must be a valid date" })
    .optional(),

  endDate: z
    .date({ invalid_type_error: "End date must be a valid date" })
    .optional(),

  included: z.array(z.string()).optional(),

  excluded: z.array(z.string()).optional(),

  amenities: z.array(z.string()).optional(),

  tourPlan: z.array(z.string()).optional(),

  maxGuest: z
    .number({ invalid_type_error: "Maximum guests must be a number" })
    .max(50, "There can't be more than 50 guests")
    .optional(),

  minAge: z
    .number({ invalid_type_error: "Minimum age must be a number" })
    .optional(),

  division: z.string().optional(),

  tourType: z.string({ required_error: "Tour type is required" }),
});
export const createTourZodSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a text",
    })
    .min(5, "Title should be at least 5 characters long")
    .max(150, "Title should be no more than 150 characters"),

  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a text",
    })
    .min(5, "Slug should be at least 5 characters long")
    .max(150, "Slug should be no more than 150 characters"),

  description: z
    .string({ invalid_type_error: "Description must be a text" })
    .min(20, "Description should be at least 20 characters long")
    .max(200, "Description should be no more than 200 characters")
    .optional(),

  images: z.array(z.string()).optional(),

  location: z
    .string({ invalid_type_error: "Location must be a text" })
    .min(10, "Location should be at least 10 characters long")
    .max(100, "Location should be no more than 100 characters")
    .optional(),

  costForm: z
    .number({ invalid_type_error: "Cost must be a number" })
    .min(0, "Cost must be a positive number")
    .optional(),

  startDate: z
    .date({ invalid_type_error: "Start date must be a valid date" })
    .optional(),

  endDate: z
    .date({ invalid_type_error: "End date must be a valid date" })
    .optional(),

  included: z.array(z.string()).optional(),

  excluded: z.array(z.string()).optional(),

  amenities: z.array(z.string()).optional(),

  tourPlan: z.array(z.string()).optional(),

  maxGuest: z
    .number({ invalid_type_error: "Maximum guests must be a number" })
    .max(50, "There can’t be more than 50 guests")
    .optional(),

  minAge: z
    .number({ invalid_type_error: "Minimum age must be a number" })
    .optional(),

  division: z.string({ required_error: "Division is required" }),

  tourType: z.string({ required_error: "Tour type is required" }),
});
