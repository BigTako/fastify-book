import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import { userCore } from "./user.core";

export const userResponceSchema = z.object({
  id: z.number(),
  ...userCore,
});

export const usersResponceSchema = z.array(userResponceSchema);

export const authResponseSchema = z.object({
  jwt: z.string(),
});

export const { schemas: userResponceSchemas, $ref } = buildJsonSchemas(
  {
    userResponceSchema,
    usersResponceSchema,
    authResponseSchema,
  },
  { $id: "UserResponceSchema" }
);
