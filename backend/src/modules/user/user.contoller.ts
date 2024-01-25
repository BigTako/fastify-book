import { FastifyReply, FastifyRequest } from "fastify";
import {
  findAll as findAllUsers,
  findOne as findOneUser,
  createOne as createOneUser,
  updateOne as updateOneUser,
  deleteOne as deleteOneUser,
} from "./user.service";
import { CreateUserInput, UpdateUserInput } from "./schemas/user.req.shemas";

export async function getAllUsers(req: FastifyRequest, res: FastifyReply) {
  const users = await findAllUsers();
  return res.code(200).send(users);
}

export async function getUser(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) {
  const { id } = req.params;
  const user = await findOneUser(Number(id));
  return res.code(200).send(user);
}

export async function createUser(
  req: FastifyRequest<{ Body: CreateUserInput }>,
  res: FastifyReply
) {
  const user = await createOneUser(req.body);
  console.log(user);
  return res.code(201).send(user);
}

export async function updateUser(
  req: FastifyRequest<{ Body: UpdateUserInput; Params: { id: string } }>,
  res: FastifyReply
) {
  const { id } = req.params;
  const user = await updateOneUser(Number(id), req.body);
  return res.code(201).send(user);
}

export async function deleteUser(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) {
  const { id } = req.params;
  await deleteOneUser(Number(id));
  return res.code(200).send(null);
}
