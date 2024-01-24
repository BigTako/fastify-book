import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import { userCore } from "./user.core";

export const userResponceSchema = z.object({
  ...userCore,
});

export const usersResponceSchema = z.array(userResponceSchema);

export const { schemas: userResponceSchemas, $ref } = buildJsonSchemas(
  {
    userResponceSchema,
    usersResponceSchema,
  },
  { $id: "UserResponceSchema" }
);
