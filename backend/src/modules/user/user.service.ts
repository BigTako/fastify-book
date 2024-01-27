import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateUserInput, UpdateUserInput } from "./schemas/user.req.shemas";

export async function findAll() {
  const users = await prisma.user.findMany();
  return users;
}

export async function findOne(where: any) {
  const user = await prisma.user.findUnique({
    where,
  });

  return user;
}

export async function createOne(input: CreateUserInput) {
  const { hash, salt } = hashPassword(input.password);

  input.password = `${salt}.${hash}`;
  input.passwordConfirm = "";

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

  return user;
}

export async function deleteOne(id: number) {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });

  return user;
}
