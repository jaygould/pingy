import { PrismaClient, PageCrawl } from "@prisma/client";
import * as cheerio from "cheerio";

type TPageParserConstructor = Pick<PageCrawl, "pageHtml">;

class PageParser {
  public db;
  public pageHtml;

  constructor({ pageHtml }: TPageParserConstructor) {
    this.db = new PrismaClient();
    this.pageHtml = pageHtml;

    if (!this.isValidHtml()) throw new Error("HTML not valid");
  }

  getHtmlBody() {
    const $ = this.loadPageToCheerio();
    return $("body").html();
  }

  getHtmlText() {
    // Returns ONLY text content, as some sites have hidden HTML attributes with values such as
    // form nonces and constantly changing security strings which make every page refresh
    // different from the last one
    const $ = this.loadPageToCheerio();
    let pageText: string = "";

    $("*").each((i, element) => {
      $(element)
        .contents()
        .each(function (i, element) {
          if (element.type === "text" && element.parent.type !== "script") {
            pageText += element.data;
          }
        });
    });

    return pageText;
  }

  private loadPageToCheerio() {
    return cheerio.load(this.pageHtml);
  }

  private isValidHtml() {
    return /<\/?[a-z][\s\S]*>/i.test(this.pageHtml);
  }
}

export { PageParser };
