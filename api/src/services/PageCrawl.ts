import { PrismaClient, Status } from "@prisma/client";
import { PageFetcher } from "./PageFetcher";
import { PageParser } from "./PageParser";
import { Alert } from "./Alert";
import { MonitorType } from "../ts-types/user.types";

class PageCrawl {
  public db: PrismaClient;
  public pageFetcher: PageFetcher;
  public pageParser!: PageParser;
  public url: string;
  public monitorType: MonitorType;

  constructor({ url, monitorType }: { url: string; monitorType: MonitorType }) {
    this.db = new PrismaClient();
    this.pageFetcher = new PageFetcher({ url });
    this.url = url;
    this.monitorType = monitorType;
  }

  async watchPage({ userId }: { userId: number }) {
    if (!this.url || !this.monitorType)
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

  async recrawlPage({ userId }: { userId: number }) {
    if (!this.url) throw new Error("No URL supplied.");

    const existingWatch = await this.isUserWatchingPage({ userId });
    if (!existingWatch) throw new Error("Page not being watched by user");

    const monitorType = this.decodeMonitorType({
      monitorType: existingWatch.monitorType,
    });

    try {
      if (monitorType.includes("pageChange")) {
        this.actionRecrawlForPageChange({ userId });
      }
      if (monitorType.includes("pageDown")) {
        this.actionRecrawlForPageDown({ userId });
      }
    } catch (e) {
      return;
    }
  }

  async actionRecrawlForPageChange({ userId }: { userId: number }) {
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
          alertType: "CONTEN_CHANGED",
          userId,
          pageUrl: this.url,
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

  async actionRecrawlForPageDown({ userId }: { userId: number }) {
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
        pageUrl: this.url,
      });

      await alert.sendAlert();

      return;
    }
  }
  async isUserWatchingPage({ userId }: { userId: number }) {
    const userWatchFound = await this.db.pageCrawl.findMany({
      where: {
        userId: userId,
        pageUrl: this.url,
        status: "initialCrawl",
      },
    });

    if (userWatchFound.length) return userWatchFound[0];

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
    monitorType,
  }: {
    userId: number;
    fetchedPage: string;
    monitorType: MonitorType;
  }) {
    return this.db.pageCrawl.create({
      data: {
        userId,
        pageUrl: this.url,
        pageHtml: fetchedPage,
        status: "initialCrawl",
        monitorType: this.encodeMonitorType({ monitorType }),
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
        pageUrl: this.url,
        pageHtml: fetchedPage,
        status: status,
        monitorType: "",
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

  private encodeMonitorType({ monitorType }: { monitorType: MonitorType }) {
    try {
      return JSON.stringify(monitorType);
    } catch (e) {
      return "";
    }
  }
  private decodeMonitorType({
    monitorType,
  }: {
    monitorType: string;
  }): Array<MonitorType> {
    try {
      return JSON.parse(monitorType);
    } catch (e) {
      return [];
    }
  }
}

export { PageCrawl };
