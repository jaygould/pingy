import { PrismaClient } from "@prisma/client";
import { PageFetcher } from "./PageFetcher";
import { PageParser } from "./PageParser";
import { Alert } from "./Alert";

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

  async recrawlPage({ userId }: { userId: number }) {
    if (!this.url) throw new Error("No URL supplied.");

    const existingWatch = await this.isUserWatchingPage({ userId });
    if (!existingWatch) throw new Error("Page not being watched");

    try {
      const fetchedPage = await this.pageFetcher.getPage();
      const parsedPage = new PageParser({
        pageHtml: fetchedPage,
      });
      const htmlBody = parsedPage.getHtmlBody();

      if (!htmlBody) throw new Error();

      const mostRecentUserPageCrawl = await this.mostRecentUserPageCrawl({
        userId: userId,
      });

      const hasChanged = this.hasPageContentChanged({
        existingPageHtml: mostRecentUserPageCrawl.pageHtml,
        currentPageHtml: htmlBody,
      });
      if (hasChanged) {
        await this.updateUserWatchingWithCrawl({
          userId,
          fetchedPage: htmlBody,
        });

        const alert = new Alert({
          alertMethods: ["EMAIL"],
          alertType: "CONTEN_CHANGED",
          userId,
          pageUrl: this.url,
        });

        await alert.sendAlert();
      }

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

  async allUserPageCrawls({ userId }: { userId: number }) {
    const pageCrawls = await this.db.pageCrawl.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: userId,
        pageUrl: this.url,
        status: {
          not: "cancelled",
        },
      },
    });

    if (pageCrawls.length) return pageCrawls;

    return [];
  }

  async mostRecentUserPageCrawl({ userId }: { userId: number }) {
    const allUserPageCrawls = await this.allUserPageCrawls({ userId });

    return allUserPageCrawls[0] || null;
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

  async updateUserWatchingWithCrawl({
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
        status: "changedContent",
      },
    });
  }

  private hasPageContentChanged({
    existingPageHtml,
    currentPageHtml,
  }: {
    existingPageHtml: string;
    currentPageHtml: string;
  }) {
    return existingPageHtml !== currentPageHtml;
  }
}

export { UserCrawl };
