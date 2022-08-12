import { MonitorType, PageCrawl as PageCrawlType } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Crawls } from "../services/Crawls";
import { PageCrawl } from "../services/PageCrawl";
import { getErrors } from "../ts-helpers/errors";

interface IWatchPageBody extends Pick<PageCrawlType, "pageUrl"> {
  monitorType: MonitorType;
}

type IWatchPageRequest = FastifyRequest<{
  Body: IWatchPageBody;
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
          pageUrl: pageUrl,
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
        const pageCrawl = new PageCrawl({
          pageUrl: pageUrl,
          monitorType: "pageDown",
        });
        await pageCrawl.recrawlPage({ userId });

        return reply.send({ message: "Success." });
      } catch (e: unknown) {
        const error = getErrors(e);

        return reply.code(400).send({ message: error });
      }
    }
  );

  fastify.get(
    `/watched-pages`,
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply: FastifyReply) => {
      const userId = request?.user?.id;

      try {
        const userCrawls = new Crawls();
        const crawls = await userCrawls.userCrawls({ userId });

        return reply.send({ message: "Success.", crawls });
      } catch (e: unknown) {
        const error = getErrors(e);

        return reply.code(400).send({ message: error });
      }
    }
  );
}

export default routes;
