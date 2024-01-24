import { FastifyReply, FastifyRequest } from "fastify";
import {
  findAll as findAllUsers,
  findOne as findOneUser,
  createOne as createOneUser,
} from "./user.service";
import { CreateUserInput } from "./schemas/user.req.shemas";
// import { CreateUserInput } from "./user.schema";

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
