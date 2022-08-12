/*
  Warnings:

  - The `monitorType` column on the `PageCrawl` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MonitorType" AS ENUM ('pageDown', 'pageChange');

-- AlterTable
ALTER TABLE "PageCrawl" DROP COLUMN "monitorType",
ADD COLUMN     "monitorType" "MonitorType"[];
