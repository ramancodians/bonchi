-- AlterTable
ALTER TABLE "hospital_partners" ADD COLUMN     "created_by_user_id" TEXT;

-- AddForeignKey
ALTER TABLE "hospital_partners" ADD CONSTRAINT "hospital_partners_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
