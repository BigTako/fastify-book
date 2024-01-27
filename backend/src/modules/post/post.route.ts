import { FastifyInstance } from "fastify";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "./post.controller";
import { createPostSchema, updatePostSchema } from "./schemas/post.req.shemas";
import { Role } from "@prisma/client";

export async function postRoutes(server: FastifyInstance) {
  server.get("/", {}, getAllPosts);
  server.get("/:id", {}, getPost);

  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: { body: createPostSchema },
    },
    createPost
  );
  server.patch(
    "/:id",
    {
      preHandler: [server.authenticate, server.restrictTo([Role.ADMIN])],
      schema: { body: updatePostSchema },
    },
    updatePost
  );
  server.delete(
    "/:id",
    { preHandler: [server.authenticate, server.restrictTo([Role.ADMIN])] },
    deletePost
  );
}
