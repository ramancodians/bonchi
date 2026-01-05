-- CreateEnum
CREATE TYPE "SupportStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropIndex
DROP INDEX "users_mobile_idx";

-- AlterTable
ALTER TABLE "operation_support_forms" ADD COLUMN     "status" "SupportStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "bonchi_cards" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "card_number" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bonchi_cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bonchi_cards_card_number_key" ON "bonchi_cards"("card_number");

-- CreateIndex
CREATE INDEX "bonchi_cards_user_id_idx" ON "bonchi_cards"("user_id");

-- AddForeignKey
ALTER TABLE "bonchi_cards" ADD CONSTRAINT "bonchi_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
