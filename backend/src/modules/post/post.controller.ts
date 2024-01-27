import { FastifyReply, FastifyRequest } from "fastify";
import {
  findAll as findAllPosts,
  findOne as findOnePost,
  updateOne as updateOnePost,
  createOne as createOnePost,
  deleteOne as deleteOnePost,
} from "../post/post.service";
import { CreatePostInput } from "./schemas/post.req.shemas";
import { User } from "@prisma/client";

export async function getAllPosts(req: FastifyRequest, res: FastifyReply) {
  const posts = await findAllPosts();
  return res.code(200).send(posts);
}

export async function getPost(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) {
  const { id } = req.params;
  const post = await findOnePost({ id: Number(id) });
  if (!post) {
    throw new Error("Post not found");
  }
  return res.code(200).send(post);
}

export async function createPost(
  req: FastifyRequest<{ Body: CreatePostInput; user: User }>,
  res: FastifyReply
) {
  const user = req.user as User;
  const post = await createOnePost({ ...req.body, authorId: user.id });
  return res.code(201).send(post);
}

export async function updatePost(
  req: FastifyRequest<{ Body: CreatePostInput; Params: { id: string } }>,
  res: FastifyReply
) {
  try {
    const { id } = req.params;
    const post = await updateOnePost(Number(id), req.body);
    return res.code(201).send(post);
  } catch (e: any) {
    if (e.code === "P2025") {
      return res.code(404).send({ statusCode: 404, message: "Post not found" });
    }
    return res.code(500).send(e);
  }
}

export async function deletePost(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) {
  try {
    const { id } = req.params;
    const post = await deleteOnePost(Number(id));
    return res.code(201).send(post);
  } catch (e: any) {
    if (e.code === "P2025") {
      return res.code(404).send({ statusCode: 404, message: "Post not found" });
    }
    return res.code(500).send(e);
  }
}
