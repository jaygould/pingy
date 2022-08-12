import { PrismaClient, PageCrawl } from "@prisma/client";
import { TUserId } from "../ts-types";

class Crawls {
  public db: PrismaClient;
  public userId: number | null;

  constructor() {
    this.db = new PrismaClient();
    this.userId = null;
  }

  async activeCrawls(): Promise<PageCrawl[]> {
    return this.db.pageCrawl.findMany({
      where: {
        status: "initialCrawl",
      },
    });
  }

  async userCrawls({ userId }: TUserId) {
    const initialCrawls = await this.db.pageCrawl.findMany({
      where: {
        status: "initialCrawl",
        userId,
      },
    });

    return Promise.all(
      initialCrawls.map(async (initialCrawl) => {
        return {
          crawl: initialCrawl,
          updates: await this.db.pageCrawl.findMany({
            where: {
              NOT: [{ status: "initialCrawl" }, { status: "cancelled" }],
              userId,
              pageUrl: initialCrawl.pageUrl,
            },
          }),
        };
      })
    );
  }
}

export { Crawls };
