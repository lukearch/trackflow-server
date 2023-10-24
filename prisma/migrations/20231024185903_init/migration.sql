-- DropForeignKey
ALTER TABLE "EventsLimits" DROP CONSTRAINT "EventsLimits_limitsId_fkey";

-- DropForeignKey
ALTER TABLE "Limits" DROP CONSTRAINT "Limits_planId_fkey";

-- AlterTable
ALTER TABLE "EventsLimits" ALTER COLUMN "limitsId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Limits" ALTER COLUMN "planId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Limits" ADD CONSTRAINT "Limits_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsLimits" ADD CONSTRAINT "EventsLimits_limitsId_fkey" FOREIGN KEY ("limitsId") REFERENCES "Limits"("id") ON DELETE SET NULL ON UPDATE CASCADE;
