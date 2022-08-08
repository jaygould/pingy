import { PrismaClient } from "@prisma/client";

class Crawls {
  public db: PrismaClient;
  public userId: number | null;

  constructor() {
    this.db = new PrismaClient();
    this.userId = null;
  }

  async activeCrawls() {
    return this.db.pageCrawl.findMany({
      where: {
        status: "initialCrawl",
      },
    });
  }

  async userCrawls({ userId }: { userId: number }) {
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
    return;
  }
}

export { Crawls };
