import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PageCrawl } from "../services/PageCrawl";
import { getErrors } from "../ts-helpers/errors";
import { MonitorType } from "../ts-types/user.types";

type IWatchPageRequest = FastifyRequest<{
  Body: { pageUrl: string; monitorType: MonitorType };
}>;

async function routes(fastify: FastifyInstance) {
  fastify.post(
    `/watch-page`,
    {
      onRequest: [fastify.authenticate],
    },
    async (request: IWatchPageRequest, reply: FastifyReply) => {
      const pageUrl = request?.body?.pageUrl;
      const monitorType = request?.body?.monitorType;
      const userId = request?.user?.id;

      try {
        const pageCrawl = new PageCrawl({
          url: pageUrl,
          monitorType: monitorType,
        });
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
        const pageCrawl = new PageCrawl({ url: pageUrl, monitorType: "" });
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
