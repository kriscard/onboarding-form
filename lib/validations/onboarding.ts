import { z } from "zod";

export const NameSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less")
    .regex(
      /^[A-Za-z'-]+(?:\s[A-Za-z'-]+)*$/,
      "First name can only contain letters",
    ),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less")
    .regex(
      /^[A-Za-z'-]+(?:\s[A-Za-z'-]+)*$/,
      "Last name can only contain letters, hyphens, and apostrophes",
    ),
});

export const PhoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(
      /^\+1[0-9]{10}$/,
      "Phone number must be a valid Canadian number starting with +1 followed by 10 digits",
    ),
});

export const CorporationSchema = z.object({
  corporationNumber: z
    .string()
    .trim()
    .min(1, "Corporation number is required")
    .regex(/^[0-9]{9}$/, "Corporation number must be exactly 9 digits"),
});

// Schema for main form
export const OnboardingSchema =
  NameSchema.merge(PhoneSchema).merge(CorporationSchema);

export type OnboardingSchemaType = z.infer<typeof OnboardingSchema>;
export type NameSchemaType = z.infer<typeof NameSchema>;
export type PhoneSchemaType = z.infer<typeof PhoneSchema>;
export type CorporationSchemaType = z.infer<typeof CorporationSchema>;
