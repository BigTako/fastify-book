import { FastifyInstance } from "fastify";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "./user.contoller";
import { $ref, userResponceSchema } from "./schemas/user.res.schemas";
import { createUserSchema, updateUserSchema } from "./schemas/user.req.shemas";

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

  server.get(
    "/:id",
    {
      schema: {
        response: {
          200: $ref("userResponceSchema"),
        },
      },
    },
    getUser
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

  server.patch(
    "/:id",
    {
      schema: {
        body: updateUserSchema,
        response: {
          201: $ref("userResponceSchema"),
        },
      },
    },
    updateUser
  );

  server.delete("/:id", {}, deleteUser);
}
