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
import { Role } from "@prisma/client";

export async function userRoutes(server: FastifyInstance) {
  server.get(
    "/",
    {
      preHandler: [server.authenticate, server.restrictTo([Role.ADMIN])],
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
      preHandler: [server.authenticate, server.restrictTo([Role.ADMIN])],
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
      preHandler: [server.authenticate, server.restrictTo([Role.ADMIN])],
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
      preHandler: [server.authenticate, server.restrictTo([Role.ADMIN])],
      schema: {
        body: updateUserSchema,
        response: {
          201: $ref("userResponceSchema"),
        },
      },
    },
    updateUser
  );

  server.delete(
    "/:id",
    { preHandler: [server.authenticate, server.restrictTo([Role.ADMIN])] },
    deleteUser
  );
}
