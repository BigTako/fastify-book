import Fastify from "fastify";
import { userResponceSchemas } from "./modules/user/schemas/user.res.schemas";
import { userRoutes } from "./modules/user/user.route";
import { handleError } from "./utils/error.handler";

function build(opts = {}) {
  const fastify = Fastify();

  fastify.setValidatorCompiler(({ schema }: { schema: any }) => {
    return (data) => schema.parse(data);
  });

  fastify.setErrorHandler((error, request, reply) => {
    handleError(error, reply);
  });

  userResponceSchemas.forEach((schema) => fastify.addSchema(schema));

  // routes
  fastify.get("/healthcheck", async (request, reply) => {
    return { status: "ok" };
  });

  fastify.register(userRoutes, { prefix: "/api/v1/users" });

  return fastify;
}

module.exports = build;
