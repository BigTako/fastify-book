import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { userResponceSchemas } from "./modules/user/schemas/user.res.schemas";
import { userRoutes } from "./modules/user/user.route";
import { handleError } from "./utils/error.handler";
import fastifyJwt from "@fastify/jwt";
import { authRoutes } from "./modules/user/auth.route";
import { findOne } from "./modules/user/user.service";
import { Role, User } from "@prisma/client";
import { postRoutes } from "./modules/post/post.route";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
    restrictTo: any;
  }
}

function build(opts = {}) {
  const fastify = Fastify();

  // fastify.setValidatorCompiler(({ schema }: { schema: any }) => {
  //   return (data) => schema.parse(data);
  // });

  // fastify.register(fastifyJwt, {
  //   secret: "123123123213123123dsfsdfsdf",
  // });

  // // check jwt in headers
  // fastify.decorate(
  //   "authenticate",
  //   async (request: FastifyRequest, reply: FastifyReply) => {
  //     try {
  //       await request.jwtVerify();
  //       const { id } = (await request.jwtVerify()) as { id: number };
  //       const user = (await findOne({ id })) || {};
  //       request.user = user;
  //     } catch (e) {
  //       return reply.send({
  //         statusCode: 401,
  //         error: "Unauthorized",
  //         message: "You are not logged in.Please log in to continue.",
  //       });
  //     }
  //   }
  // );

  // fastify.decorate("restrictTo", (roles: Role[]) => {
  //   return async (request: FastifyRequest, reply: FastifyReply) => {
  //     const user = request.user as User;
  //     if (!user) {
  //       return reply.send(
  //         new Error("You are not logged in.Please log in to continue.")
  //       );
  //     }
  //     if (!roles.includes(user.role)) {
  //       return reply.send(
  //         new Error("You do not have permission to do this action.")
  //       );
  //     }
  //   };
  // });

  // fastify.setErrorHandler((error, request, reply) => {
  //   handleError(error, reply);
  // });

  // userResponceSchemas.forEach((schema) => fastify.addSchema(schema));

  // // routes
  fastify.get("/healthcheck", async (request, reply) => {
    return { status: "ok" };
  });

  // fastify.register(userRoutes, { prefix: "/api/v1/users" });
  // fastify.register(authRoutes, { prefix: "/api/v1/auth" });
  // fastify.register(postRoutes, { prefix: "/api/v1/posts" });

  return fastify;
}

module.exports = build;
