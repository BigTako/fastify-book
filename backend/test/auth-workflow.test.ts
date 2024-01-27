import { Post, User } from "@prisma/client";
import { FastifyInstance } from "fastify";
import prisma from "../src/utils/prisma";
("use strict");
import { createOne as createOneUser } from "../src/modules/user/user.service";

const build = require("../src/app"); // replace with the path to your Fastify app

describe("Healthcheck", () => {
  const admin = {
    name: "admin",
    email: "admin@prisma.com",
    password: "test12345",
    passwordConfirm: "test12345",
  };

  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
    await prisma.$connect();
    await prisma.user.deleteMany();
    await prisma.post.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.post.deleteMany();
    await prisma.$disconnect();
    app.close();
  });

  test("should signup new user", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/auth/signup",
      payload: {
        email: "signup@test.com",
        name: "signup",
        password: "test12345",
        passwordConfirm: "test12345",
      },
    });

    expect(response.statusCode).toBe(201);

    const res = await response.json();
    expect(res).toEqual({
      jwt: expect.any(String),
    });
  });

  test("should login user", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: {
        email: "signup@test.com",
        password: "test12345",
      },
    });

    expect(response.statusCode).toBe(201);

    const res = await response.json();

    expect(res).toEqual({
      jwt: expect.any(String),
    });
  });

  test("should throw an error trying to login to unexisting account", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: {
        email: "unexisting@test.com",
        password: "test12345",
      },
    });

    expect(response.statusCode).toEqual(400);
    const res = await response.json();
    expect(res.message).toContain("Invalid email or password");
  });
});
