import { z } from "zod";
import { Role, userCore } from "./user.core";

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

export type CreateUserInput = z.infer<typeof createUserSchema>;
