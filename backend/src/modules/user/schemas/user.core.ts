import { z } from "zod";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export const userCore = {
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
};
