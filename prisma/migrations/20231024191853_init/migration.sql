/*
  Warnings:

  - You are about to drop the column `limitsId` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the `EventsLimits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Limits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventsLimits" DROP CONSTRAINT "EventsLimits_limitsId_fkey";

-- DropForeignKey
ALTER TABLE "Limits" DROP CONSTRAINT "Limits_planId_fkey";

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "limitsId",
ADD COLUMN     "maxEvents" INTEGER NOT NULL DEFAULT 2500;

-- DropTable
DROP TABLE "EventsLimits";

-- DropTable
DROP TABLE "Limits";
