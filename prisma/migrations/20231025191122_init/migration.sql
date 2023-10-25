/*
  Warnings:

  - You are about to drop the column `duration` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "duration";

-- CreateTable
CREATE TABLE "Duration" (
    "id" TEXT NOT NULL,
    "planId" TEXT,
    "durationInMonths" INTEGER DEFAULT 1,
    "discount" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "Duration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Duration" ADD CONSTRAINT "Duration_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
