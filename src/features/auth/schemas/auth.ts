import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
    roleType: z.enum(["brand", "agency", "talent"]),
    workspaceName: z.string().trim().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.roleType === "talent" || (data.workspaceName && data.workspaceName.length > 0), {
    message: "Workspace name is required for Brand and Agency roles",
    path: ["workspaceName"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
