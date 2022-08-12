import { Prisma, PrismaClient, PageCrawl } from "@prisma/client";
import axios, { AxiosError } from "axios";

interface IPageFetcherConstructor extends Pick<PageCrawl, "pageUrl"> {}

class PageFetcher {
  public db;
  public pageUrl;

  constructor({ pageUrl }: IPageFetcherConstructor) {
    const prisma = new PrismaClient();
    this.db = prisma;
    this.pageUrl = pageUrl;
  }

  async getPage(): Promise<string> {
    if (!this.pageUrl) {
      throw new Error("You must sent a URL.");
    }

    if (!this.validateUrl(this.pageUrl)) {
      throw new Error("Please use a valid URL.");
    }

    try {
      const response = await axios.get(this.pageUrl);
      return response?.data;
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        throw new Error(
          `There was a problem fetching ${this.pageUrl}. The page returned ${
            e?.response?.status || "unknown"
          }.`
        );
      }

      throw new Error(`There was a problem fetching ${this.pageUrl}.`);
    }
  }

  private validateUrl(pageUrl: string): boolean {
    const re =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    return re.test(String(pageUrl).toLowerCase());
  }
}

export { PageFetcher };
