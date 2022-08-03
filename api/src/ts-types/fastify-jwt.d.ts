import "@fastify/jwt";
import { IUserPayload } from "./user.types";
import { FastifyRequest } from "fastify";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number }; // payload type is used for signing and verifying
    user: IUserPayload; // user type is return type of `request.user` object
  }
}
