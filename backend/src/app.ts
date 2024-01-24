import Fastify from "fastify";

import { userRoutes } from "./modules/user/user.route";
import { userResponceSchemas } from "./modules/user/schemas/user.res.schemas";
import { z } from "zod";
// const schemaCompiler = require("./utils/validators");

export const server = Fastify();

// server.setValidatorCompiler(({ schema, method, url, httpPart }) => {
//   return schemaCompiler(schema);
// });

server.setValidatorCompiler(({ schema }: { schema: any }) => {
  return (data) => schema.parse(data);
});

server.setErrorHandler((error, request, reply) => {
  if (error instanceof z.ZodError) {
    reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: error.errors.map((err) => ({
        code: err.code,
        message: err.message,
        path: err.path,
      })),
    });
  } else {
    reply.send(error);
  }
});

// server.setSerializerCompiler(({ schema }: { schema: any }) => {
//   return (data) => schema.parse(data);
// });

server.get("/", async function () {
  return { hello: "world" };
});

async function main() {
  userResponceSchemas.forEach((schema) => server.addSchema(schema));

  server.register(userRoutes, { prefix: "api/v1/users" });

  try {
    // host is specified to run in docker container
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`Server listening at port ${3000}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
