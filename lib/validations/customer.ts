import { z } from "zod";

export const customerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  companyName: z.string().optional(),
  mailboxNumber: z.string().min(1, "Mailbox number is required"),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((v) => !v || z.email().safeParse(v).success, {
      message: "Invalid email address",
    }),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  status: z.enum(["ACTIVE", "CANCELLED", "EXPIRED", "PENDING"]),
  notes: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
