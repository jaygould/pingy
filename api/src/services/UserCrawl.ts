import { Prisma, PrismaClient } from "@prisma/client";
import { PageFetcher } from "./PageFetcher";
import { PageParser } from "./PageParser";

class UserCrawl {
  public db: PrismaClient;
  public pageFetcher: PageFetcher;
  public pageParser!: PageParser;
  public url: string;

  constructor({ url }: { url: string }) {
    this.db = new PrismaClient();
    this.pageFetcher = new PageFetcher({ url });
    this.url = url;
  }

  async watchPage({ userId }: { userId: number }) {
    if (!this.url) throw new Error("No URL supplied.");

    const existingWatch = await this.isUserWatchingPage({ userId });

    if (existingWatch) throw new Error("You are already watching this page.");

    try {
      const fetchedPage = await this.pageFetcher.getPage();

      const parsedPage = new PageParser({
        pageHtml: fetchedPage,
      });

      const htmlBody = parsedPage.getHtmlBody();

      // TODO: take screenshot of page so user can see back to when it was first added?

      if (!htmlBody) throw new Error();

      await this.beginUserWatchingPage({ userId, fetchedPage: htmlBody });

      return;
    } catch (e: unknown | Error) {
      throw new Error(
        e instanceof Error
          ? e.message
          : "There was a problem fetching the page."
      );
    }
  }

  async isUserWatchingPage({ userId }: { userId: number }) {
    const userFound = await this.db.pageCrawl.findMany({
      where: {
        userId: userId,
        pageUrl: this.url,
        status: {
          not: "cancelled",
        },
      },
    });

    if (userFound.length) return true;

    return false;
  }

  async beginUserWatchingPage({
    userId,
    fetchedPage,
  }: {
    userId: number;
    fetchedPage: string;
  }) {
    return this.db.pageCrawl.create({
      data: {
        userId,
        pageUrl: this.url,
        pageHtml: fetchedPage,
        status: "initialCrawl",
      },
    });
  }
}

export { UserCrawl };
