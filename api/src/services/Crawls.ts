import { PrismaClient } from "@prisma/client";

class Crawls {
  public db: PrismaClient;

  constructor() {
    this.db = new PrismaClient();
  }

  async activeCrawls() {
    return this.db.pageCrawl.findMany({
      where: {
        status: "initialCrawl",
      },
    });
  }
}

export { Crawls };
