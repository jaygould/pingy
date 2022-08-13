export interface ICrawl {
  id: number;
  userId: number;
  pageHtml: string;
  pageUrl: string;
  status: "initialCrawl" | "changedContent" | "pageDown" | "cancelled";
  monitorType: "pageChange" | "pageDown" | "";
  createdAt: string;
}

export type TGroupedCrawls = Array<{
  crawl: ICrawl;
  updates: Array<ICrawl>;
}>;

export type TCrawlerFields = Pick<ICrawl, "pageUrl" | "monitorType">;
