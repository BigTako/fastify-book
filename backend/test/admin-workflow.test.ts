const build = require("../src/app"); // replace with the path to your Fastify app
import { FastifyInstance } from "fastify";
import prisma from "../src/utils/prisma";
import { Post, User } from "@prisma/client";
import { createOne as createOneUser } from "../src/modules/user/user.service";

describe("Admin workflow", () => {
  const admin = {
    name: "admin",
    email: "admin@prisma.com",
    password: "test12345",
    passwordConfirm: "test12345",
  };

  let app: FastifyInstance;
  let createdUser: User;
  let createdPost: Post;
  let loggedInAdmin: User;
  let jwt: string;

  beforeAll(async () => {
    app = build();
    await app.ready();
    await prisma.$connect();
    await prisma.user.deleteMany();
    loggedInAdmin = await createOneUser(admin);
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

  describe("Authentification", () => {
    test("should login admin", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/login",
        payload: {
          email: admin.email,
          password: admin.password,
        },
      });
    });
  });

  describe("Admin interraction with users", () => {
    test("should create a user with correct body", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/users",
        headers: {
          authorization: `Bearer ${jwt}`,
        },
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
      });

      expect(res.password).not.toBeDefined();
      expect(res.passwordConfirm).not.toBeDefined();
      createdUser = res;
    });

    test("should get all users", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/v1/users",
        headers: {
          authorization: `Bearer ${jwt}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const res = await response.json();
      expect(res).toEqual([createdUser]);
    });

    test("should get user by id", async () => {
      const response = await app.inject({
        method: "GET",
        url: `/api/v1/users/${createdUser.id}`,
        headers: {
          authorization: `Bearer ${jwt}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const res = await response.json();
      expect(res).toEqual(createdUser);
    });

    test("should throw an error trying to create a user with existing email", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/users",
        headers: {
          authorization: `Bearer ${jwt}`,
        },
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
        headers: {
          authorization: `Bearer ${jwt}`,
        },
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
        headers: {
          authorization: `Bearer ${jwt}`,
        },
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
        headers: {
          authorization: `Bearer ${jwt}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(await response.json()).toBeNull();
    });
  });

  describe("Admin interraction with posts", () => {
    test("should create a post with correct body", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/posts",
        headers: {
          authorization: `Bearer ${jwt}`,
        },
        payload: {
          title: "some_title",
          content: "content",
        },
      });

      expect(response.statusCode).toBe(201);
      const res = await response.json();
      expect(res).toEqual({
        id: expect.any(Number),
        title: "some_title",
        content: "content",
      });
    });

    test("should get all posts", async () => {
      const response = await app.inject({
        method: "GET",
        headers: {
          authorization: `Bearer ${jwt}`,
        },
        url: "/api/v1/posts",
      });

      expect(response.statusCode).toBe(200);
      const res = await response.json();
      expect(res).toEqual([createdPost]);
    });

    test("should get post by id", async () => {
      const response = await app.inject({
        method: "GET",
        headers: {
          authorization: `Bearer ${jwt}`,
        },
        url: `/api/v1/posts/${createdPost.id}`,
      });

      expect(response.statusCode).toBe(200);
      const res = await response.json();
      expect(res).toEqual(createdPost);
    });

    test("should throw an error trying to create a post with invalid field", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/posts",
        headers: {
          authorization: `Bearer ${jwt}`,
        },
        payload: {
          content: "content",
        },
      });

      expect(response.statusCode).toBe(400);
    });

    test("should update post by id", async () => {
      const response = await app.inject({
        method: "PATCH",
        url: `/api/v1/posts/${createdPost.id}`,
        headers: {
          authorization: `Bearer ${jwt}`,
        },
        payload: {
          title: "new_title",
        },
      });

      expect(response.statusCode).toBe(201);
      const res = await response.json();
      expect(res.title).toBe("new_title");
    });

    test("should delete post by id", async () => {
      const response = await app.inject({
        method: "DELETE",
        headers: {
          authorization: `Bearer ${jwt}`,
        },
        url: `/api/v1/posts/${createdPost.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(await response.json()).toBeNull();
    });
  });
});
