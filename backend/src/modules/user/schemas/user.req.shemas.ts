import { z } from "zod";
import { Role } from "./user.core";

export const passwordSchema = z
  .object({
    password: z.string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match",
    path: ["passwordConfirm"],
  });

export const createUserSchema = z
  .object({
    name: z.string(),
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email(),
    role: z.nativeEnum(Role).optional(),
    active: z.boolean().optional(),
    activated: z.boolean().optional(),
  })
  .and(passwordSchema);

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(Role).optional(),
  active: z.boolean().optional(),
  activated: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
  })
  .and(passwordSchema);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type PasswordInput = z.infer<typeof passwordSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
