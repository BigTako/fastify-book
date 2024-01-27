import { FastifyReply, FastifyRequest } from "fastify";
import {
  findAll as findAllUsers,
  findOne as findOneUser,
  createOne as createOneUser,
  updateOne as updateOneUser,
  deleteOne as deleteOneUser,
} from "./user.service";
import {
  CreateUserInput,
  LoginInput,
  SignupInput,
  UpdateUserInput,
} from "./schemas/user.req.shemas";
import { server } from "../../server";
import { verifyPassword } from "../../utils/hash";

export async function getAllUsers(req: FastifyRequest, res: FastifyReply) {
  console.log("user from request", req.user);
  const users = await findAllUsers();

  return res.code(200).send(users);
}

export async function getUser(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) {
  const { id } = req.params;
  const user = await findOneUser({ id: Number(id) });
  if (!user) {
    throw new Error("Users not found");
  }
  return res.code(200).send(user);
}

export async function createUser(
  req: FastifyRequest<{ Body: CreateUserInput }>,
  res: FastifyReply
) {
  const user = await createOneUser(req.body);
  return res.code(201).send(user);
}

export async function updateUser(
  req: FastifyRequest<{ Body: UpdateUserInput; Params: { id: string } }>,
  res: FastifyReply
) {
  const { id } = req.params;
  const user = await updateOneUser(Number(id), req.body);
  if (!user) {
    throw new Error("Users not found");
  }
  return res.code(201).send(user);
}

export async function deleteUser(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) {
  const { id } = req.params;
  const user = await deleteOneUser(Number(id));
  if (!user) {
    throw new Error("Users not found");
  }
  return res.code(200).send(null);
}

export async function signup(req: FastifyRequest<{ Body: SignupInput }>) {
  const body = req.body;
  const user = await findOneUser({ email: body.email });

  if (user) {
    throw new Error("This email is already in use.Choose another one.");
  }

  const newUser = await createOneUser(body);

  return {
    jwt: server.jwt.sign({
      id: newUser.id,
    }),
  };
}

export async function login(
  req: FastifyRequest<{ Body: LoginInput }>,
  res: FastifyReply
) {
  const body = req.body;
  // check if account exists
  const user = await findOneUser({ email: body.email });

  if (!user) {
    throw new Error("Invalid email or password");
  }
  // check if password is correct
  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    dbPassword: user.password,
  });

  // sign jwt
  if (correctPassword) {
    return {
      jwt: server.jwt.sign({
        id: user.id,
      }),
    };
  }

  throw new Error("Invalid email or password");
}
