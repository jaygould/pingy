import {
  PrismaClient,
  Status,
  MonitorType,
  PageCrawl as PageCrawlType,
} from "@prisma/client";
import { PageFetcher } from "./PageFetcher";
import { PageParser } from "./PageParser";
import { Alert } from "./Alert";
import { TUserId } from "../ts-types";

interface IPageCrawlConstructor extends Pick<PageCrawlType, "pageUrl"> {
  monitorType: MonitorType;
}

class PageCrawl {
  public db: PrismaClient;
  public pageFetcher: PageFetcher;
  public pageParser!: PageParser;
  public pageUrl;
  public monitorType;

  constructor({ pageUrl, monitorType }: IPageCrawlConstructor) {
    this.db = new PrismaClient();
    this.pageFetcher = new PageFetcher({ pageUrl });
    this.pageUrl = pageUrl;
    this.monitorType = monitorType;
  }

  async watchPage({ userId }: TUserId) {
    if (!this.pageUrl || !this.monitorType)
      throw new Error("Please supply URL and monitor type.");

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

      await this.beginUserWatchingPage({
        userId,
        fetchedPage: htmlBody,
        monitorType: this.monitorType,
      });

      return;
    } catch (e: unknown | Error) {
      throw new Error(
        e instanceof Error
          ? e.message
          : "There was a problem fetching the page."
      );
    }
  }

  async recrawlPage({ userId }: TUserId) {
    if (!this.pageUrl) throw new Error("No URL supplied.");

    const existingWatch = await this.isUserWatchingPage({ userId });
    if (!existingWatch) throw new Error("Page not being watched by user");
    if (!existingWatch.monitorType) throw new Error("No monitor type selected");

    try {
      if (existingWatch.monitorType.includes("pageChange")) {
        this.actionRecrawlForPageChange({ userId });
      }
      if (existingWatch.monitorType.includes("pageDown")) {
        this.actionRecrawlForPageDown({ userId });
      }
    } catch (e) {
      return;
    }
  }

  async actionRecrawlForPageChange({ userId }: TUserId) {
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
          status: "changedContent",
        });

        const alert = new Alert({
          alertMethods: ["EMAIL"],
          alertType: "CONTENT_CHANGED",
          userId,
          pageUrl: this.pageUrl,
        });

        await alert.sendAlert();
      }

      return;
    } catch (e: unknown | Error) {
      // If page is down when looking for updated content, it doesn't matter, as user
      // should not be told unless they are looking for page down specifically
      return;
    }
  }

  async actionRecrawlForPageDown({ userId }: TUserId) {
    try {
      await this.pageFetcher.getPage();
      return;
    } catch (e) {
      // If page is down when user is monitoring page down, don't return error as this is to be
      // handled manually as an alert

      await this.updateUserWatchingWithCrawl({
        userId,
        fetchedPage: "",
        status: "pageDown",
      });

      const alert = new Alert({
        alertMethods: ["EMAIL"],
        alertType: "SITE_DOWN",
        userId,
        pageUrl: this.pageUrl,
      });

      await alert.sendAlert();

      return;
    }
  }
  async isUserWatchingPage({ userId }: TUserId) {
    const userWatchFound = await this.db.pageCrawl.findMany({
      where: {
        userId: userId,
        pageUrl: this.pageUrl,
        status: "initialCrawl",
      },
    });

    if (userWatchFound.length) return userWatchFound[0];

    return false;
  }

  async allUserPageCrawls({ userId }: TUserId) {
    const pageCrawls = await this.db.pageCrawl.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: userId,
        pageUrl: this.pageUrl,
        status: {
          not: "cancelled",
        },
      },
    });

    if (pageCrawls.length) return pageCrawls;

    return [];
  }

  async mostRecentUserPageCrawl({ userId }: TUserId) {
    const allUserPageCrawls = await this.allUserPageCrawls({ userId });

    return allUserPageCrawls[0] || null;
  }

  async beginUserWatchingPage({
    userId,
    fetchedPage,
    monitorType,
  }: {
    userId: number;
    fetchedPage: string;
    monitorType: MonitorType;
  }) {
    return this.db.pageCrawl.create({
      data: {
        userId,
        pageUrl: this.pageUrl,
        pageHtml: fetchedPage,
        status: "initialCrawl",
        monitorType: monitorType,
      },
    });
  }

  async updateUserWatchingWithCrawl({
    userId,
    fetchedPage,
    status,
  }: {
    userId: number;
    fetchedPage: string;
    status: Status;
  }) {
    return this.db.pageCrawl.create({
      data: {
        userId,
        pageUrl: this.pageUrl,
        pageHtml: fetchedPage,
        status: status,
        monitorType: [],
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
    const existingText = new PageParser({
      pageHtml: existingPageHtml,
    }).getHtmlText();

    const currentText = new PageParser({
      pageHtml: currentPageHtml,
    }).getHtmlText();

    return existingText !== currentText;
  }
}

export { PageCrawl };
