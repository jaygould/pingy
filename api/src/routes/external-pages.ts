import { PageCrawl } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PageFetcher } from "../services/PageFetcher";
import { getErrors } from "../ts-helpers/errors";

type TPageUrl = Pick<PageCrawl, "pageUrl">;
type IGetPageRequest = FastifyRequest<{ Querystring: TPageUrl }>;

async function routes(fastify: FastifyInstance) {
  fastify.get(
    `/external-page`,
    async (request: IGetPageRequest, reply: FastifyReply) => {
      const pageUrl = request?.query?.pageUrl;

      try {
        const auth = new PageFetcher({ pageUrl: pageUrl });
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
