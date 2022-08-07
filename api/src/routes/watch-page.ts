import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PageCrawl } from "../services/PageCrawl";
import { getErrors } from "../ts-helpers/errors";

type IWatchPageRequest = FastifyRequest<{
  Body: { pageUrl: string };
}>;

async function routes(fastify: FastifyInstance) {
  fastify.post(
    `/watch-page`,
    {
      onRequest: [fastify.authenticate],
    },
    async (request: IWatchPageRequest, reply: FastifyReply) => {
      const pageUrl = request?.body?.pageUrl;
      const userId = request?.user?.id;

      try {
        const pageCrawl = new PageCrawl({ url: pageUrl });
        await pageCrawl.watchPage({ userId });

        return reply.send({ message: "Success." });
      } catch (e: unknown) {
        const error = getErrors(e);

        return reply.code(400).send({ message: error });
      }
    }
  );
  fastify.post(
    `/recrawl-page`,
    {
      onRequest: [fastify.authenticate],
    },
    async (request: IWatchPageRequest, reply: FastifyReply) => {
      const pageUrl = request?.body?.pageUrl;
      const userId = request?.user?.id;

      try {
        const pageCrawl = new PageCrawl({ url: pageUrl });
        await pageCrawl.recrawlPage({ userId });

        return reply.send({ message: "Success." });
      } catch (e: unknown) {
        const error = getErrors(e);

        return reply.code(400).send({ message: error });
      }
    }
  );
}

export default routes;
