import { Prisma, PrismaClient } from "@prisma/client";
import axios, { AxiosError } from "axios";

class PageFetcher {
  public db;
  public url;

  constructor({ url }: { url: string }) {
    const prisma = new PrismaClient();
    this.db = prisma;
    this.url = url;
  }

  async getPage(): Promise<string> {
    if (!this.url) {
      throw new Error("You must sent a URL.");
    }

    if (!this.validateUrl(this.url)) {
      throw new Error("Please use a valid URL.");
    }

    try {
      const response = await axios.get(this.url);
      return response?.data;
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        throw new Error(
          `There was a problem fetching ${this.url}. The page returned ${
            e?.response?.status || "unknown"
          }.`
        );
      }

      throw new Error(`There was a problem fetching ${this.url}.`);
    }
  }

  validateUrl(url: string) {
    const re =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    return re.test(String(url).toLowerCase());
  }
}

export { PageFetcher };
