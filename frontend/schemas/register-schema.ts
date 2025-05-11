import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, { message: "Must include at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Must include at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Must include at least one special character",
    }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
