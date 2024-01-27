import prisma from "../../utils/prisma";
import {
  CreatePostServiceInput,
  UpdatePostInput,
} from "./schemas/post.req.shemas";

export async function findAll() {
  const posts = await prisma.post.findMany();
  return posts;
}

export async function findOne(where: any) {
  const post = await prisma.post.findUnique({ where });
  return post;
}

export async function createOne(input: CreatePostServiceInput) {
  const post = await prisma.post.create({ data: input });
  console.log(post);
  return post;
}

export async function updateOne(id: number, input: UpdatePostInput) {
  const post = await prisma.post.update({ where: { id }, data: input });
  return post;
}

export async function deleteOne(id: number) {
  const post = await prisma.post.delete({ where: { id } });
  return post;
}
