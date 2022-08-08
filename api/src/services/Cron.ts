import { PrismaClient } from "@prisma/client";
import * as cronLib from "node-cron";
import { Crawls } from "./Crawls";
import { PageCrawl } from "./PageCrawl";

class Cron {
  public db;
  public cron;
  public crawls;

  constructor() {
    this.db = new PrismaClient();
    this.crawls = new Crawls();
    this.cron = cronLib;
  }

  startCron() {
    return this.cron.schedule("* * * * *", () => {
      this.htmlChangeCron();
    });
  }

  // TODO: add tp queueing system
  private async htmlChangeCron() {
    const activeCrawls = await this.crawls.activeCrawls();
    if (!activeCrawls || !activeCrawls.length) return;

    activeCrawls.map(async (crawl) => {
      const userId = crawl.userId;
      const pageUrl = crawl.pageUrl;
      const pageCrawl = new PageCrawl({ url: pageUrl, monitorType: "" });
      return pageCrawl.recrawlPage({ userId });
    });
  }

  private async pageDownCron() {
    // TODO: change setup so the type of cron is logged with initial crawl so they can chose page down and/or changes
  }
}

export { Cron };
