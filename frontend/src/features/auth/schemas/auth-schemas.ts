import * as z from "zod";

export const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(3, { message: "Please enter a valid email address or government username." }),
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters." }),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: "Please enter your registered government email or employee ID." }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const otpVerifySchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 numerical digits." })
    .regex(/^\d+$/, { message: "OTP must contain only numbers." }),
});

export type OTPVerifyFormValues = z.infer<typeof otpVerifySchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
      .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
      .regex(/[0-9]/, { message: "Must contain at least one numerical digit." })
      .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character (@$!%*#?&)." }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
