/*
  Warnings:

  - You are about to drop the `Duration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Duration" DROP CONSTRAINT "Duration_planId_fkey";

-- DropTable
DROP TABLE "Duration";

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "planId" TEXT,
    "durationInMonths" INTEGER DEFAULT 1,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "totalPrice" DOUBLE PRECISION,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
