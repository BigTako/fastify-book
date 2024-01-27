import { FastifyInstance } from "fastify";
import { loginSchema, signupSchema } from "./schemas/user.req.shemas";
import { $ref } from "./schemas/user.res.schemas";
import { login, signup } from "./user.contoller";

export async function authRoutes(server: FastifyInstance) {
  server.post(
    "/login",
    {
      schema: {
        body: loginSchema,
        response: {
          201: $ref("authResponseSchema"),
        },
      },
    },
    login
  );

  server.post(
    "/signup",
    {
      schema: {
        body: signupSchema,
        response: {
          201: $ref("authResponseSchema"),
        },
      },
    },
    signup
  );
}
