-- DropForeignKey
ALTER TABLE "Duration" DROP CONSTRAINT "Duration_planId_fkey";

-- AddForeignKey
ALTER TABLE "Duration" ADD CONSTRAINT "Duration_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
