import { Prisma, PrismaClient } from "@prisma/client";
import * as cheerio from "cheerio";

class PageParser {
  public db;
  public pageHtml;

  constructor({ pageHtml }: { pageHtml: string }) {
    this.db = new PrismaClient();
    this.pageHtml = pageHtml;

    if (!this.isValidHtml()) throw new Error("HTML not valid");
  }

  getHtmlBody() {
    const $ = this.loadPageToCheerio();
    return $("body").html();
  }

  private loadPageToCheerio() {
    return cheerio.load(this.pageHtml);
  }

  private isValidHtml() {
    return /<\/?[a-z][\s\S]*>/i.test(this.pageHtml);
  }
}

export { PageParser };
