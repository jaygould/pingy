-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'pageDown';

-- AlterTable
ALTER TABLE "PageCrawl" ADD COLUMN     "monitorType" TEXT NOT NULL DEFAULT E'';
