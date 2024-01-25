import { Prisma } from "@prisma/client";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

function handleDuplicateFieldsDb(err: Prisma.PrismaClientKnownRequestError) {
  const errorMessage = err.message;
  const match = errorMessage.match(/fields: \((`.*`)\)/);
  const fieldNames = match?.[0].replace(/fields: \(`(.*)`\)/, "$1") ?? "";
  const message = `Duplicate field value: ${fieldNames}. Please use another value`;
  return {
    statusCode: 400,
    message: [message],
  };
}

export function handleError(error: FastifyError, reply: FastifyReply) {
  error.statusCode = error.statusCode || 500;

  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      message: error.errors.map((err) => err.message),
    });
  }

  if (process.env.NODE_ENV === "production") {
    let err = {
      statusCode: error.statusCode,
      message: [error.message],
    };

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Unique constait failed
        err = handleDuplicateFieldsDb(error);
      }
    }
    console.log(err);
    return reply.status(err.statusCode as number).send({
      statusCode: err.statusCode,
      message: err.message,
    });
    // format error message
  } else {
    return reply.status(error.statusCode as number).send({
      statusCode: error.statusCode,
      message: [error.message],
    });
  }
}
