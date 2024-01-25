"use strict";

import { FastifyInstance } from "fastify";
import prisma from "../src/utils/prisma";
import { User } from "@prisma/client";

const build = require("../src/app"); // replace with the path to your Fastify app

describe("Healthcheck", () => {
  let app: FastifyInstance;
  let createdUser: User;

  beforeAll(async () => {
    app = build();
    await app.ready();
    await prisma.$connect();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    app.close();
  });

  test('should respond with status "ok" on /healthcheck', async () => {
    const response = await app.inject({
      method: "GET",
      url: "/healthcheck",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
  });

  describe("Admin interraction with users", () => {
    test("should create a user with correct body", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/users",
        payload: {
          email: "test@test.com",
          name: "test",
          password: "test12345",
          passwordConfirm: "test12345",
        },
      });

      expect(response.statusCode).toBe(201);
      const res = await response.json();
      expect(res).toEqual({
        id: expect.any(Number),
        name: "test",
        role: "USER",
        email: "test@test.com",
        active: false,
        activated: false,
      });

      expect(res.password).not.toBeDefined();
      expect(res.passwordConfirm).not.toBeDefined();
      createdUser = res;
    });

    test("should get all users", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/v1/users",
      });

      expect(response.statusCode).toBe(200);
      const res = await response.json();
      expect(res).toEqual([createdUser]);
    });

    test("should get user by id", async () => {
      const response = await app.inject({
        method: "GET",
        url: `/api/v1/users/${createdUser.id}`,
      });

      expect(response.statusCode).toBe(200);
      const res = await response.json();
      expect(res).toEqual(createdUser);
    });

    test("should throw an error trying to create a user with existing email", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/users",
        payload: {
          email: "test@test.com",
          name: "test",
          password: "test12345",
          passwordConfirm: "test12345",
        },
      });

      expect(response.statusCode).toBe(500);
    });

    test("should throw an error trying to create a user with invalid field", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/users",
        payload: {
          email: "test@test.com",
          name: "test",
          password: "test12345",
          passwordConfirm: "test1234",
        },
      });

      const res = await response.json();
      expect(response.statusCode).toBe(400);
      expect(res.message).toContain("Passwords must match");
    });

    test("should update user by id", async () => {
      const response = await app.inject({
        method: "PATCH",
        url: `/api/v1/users/${createdUser.id}`,
        payload: {
          name: "testUpdated",
        },
      });

      expect(response.statusCode).toBe(201);
      const res = await response.json();
      expect(res.name).toBe("testUpdated");
    });

    test("should delete user by id", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: `/api/v1/users/${createdUser.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(await response.json()).toBeNull();
    });
  });
});
