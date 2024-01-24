import { FastifyInstance } from "fastify";
import { createUser, getAllUsers } from "./user.contoller";
import { $ref, userResponceSchema } from "./schemas/user.res.schemas";
import { createUserSchema } from "./schemas/user.req.shemas";

export async function userRoutes(server: FastifyInstance) {
  server.get(
    "/",
    {
      schema: {
        response: {
          200: $ref("usersResponceSchema"),
        },
      },
    },

    getAllUsers
  );

  server.post(
    "/",
    {
      schema: {
        body: createUserSchema,
        response: {
          201: $ref("userResponceSchema"),
        },
      },
    },
    createUser
  );
}
