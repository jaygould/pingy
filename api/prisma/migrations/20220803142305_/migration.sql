-- CreateEnum
CREATE TYPE "Status" AS ENUM ('initialCrawl', 'changedContent', 'cancelled');

-- CreateTable
CREATE TABLE "PageCrawl" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "pageHtml" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageCrawl_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PageCrawl" ADD CONSTRAINT "PageCrawl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
