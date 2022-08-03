import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export const authPlugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SECRET,
  });

  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        // jwtVerify has been typed on the request porperty in ts-types/fastify.d.ts, and as that file
        // has an import, it needs to be either ///referenced in this file to be used here, or added to
        // the files array in tsconfig (as it currently is)
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
};

export default fp(authPlugin, "4.x");
