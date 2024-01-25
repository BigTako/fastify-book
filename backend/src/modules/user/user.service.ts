import prisma from "../../utils/prisma";
import { CreateUserInput, UpdateUserInput } from "./schemas/user.req.shemas";

export async function findAll() {
  const users = await prisma.user.findMany();
  return users;
}

export async function findOne(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("Document not found");
  }
  return user;
}

export async function createOne(input: CreateUserInput) {
  const user = await prisma.user.create({
    data: input,
  });
  return user;
}

export async function updateOne(id: number, input: UpdateUserInput) {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: input,
  });

  if (!user) {
    throw new Error("Document not found");
  }

  return user;
}

export async function deleteOne(id: number) {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("Document not found");
  }

  return null;
}
