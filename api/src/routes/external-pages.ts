import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PageFetcher } from "../services/PageFetcher";
import { getErrors } from "../ts-helpers/errors";

type IGetPageRequest = FastifyRequest<{ Querystring: { pageUrl: string } }>;

async function routes(fastify: FastifyInstance) {
  fastify.get(
    `/external-page`,
    async (request: IGetPageRequest, reply: FastifyReply) => {
      const pageUrl = request?.query?.pageUrl;

      try {
        const auth = new PageFetcher({ url: pageUrl });
        const page = await auth.getPage();

        return reply.send({ page });
      } catch (e: unknown) {
        const error = getErrors(e);
        return reply.code(400).send({ message: error });
      }
    }
  );
}

export default routes;
