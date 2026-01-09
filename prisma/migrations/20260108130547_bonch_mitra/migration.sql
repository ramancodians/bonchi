/*
  Warnings:

  - You are about to drop the column `area_locality` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `block` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `full_address` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `block` on the `medical_stores` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `medical_stores` table. All the data in the column will be lost.
  - You are about to drop the column `full_address` on the `medical_stores` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `medical_stores` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `medical_stores` table. All the data in the column will be lost.
  - You are about to drop the column `village_ward` on the `medical_stores` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('MOBILE_SHOP', 'INTERNET_CENTRE', 'CYBER_CAFE', 'MEDICAL_STORE', 'OTHER');

-- CreateEnum
CREATE TYPE "AreaType" AS ENUM ('RURAL', 'SEMI_URBAN', 'URBAN');

-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('ACTIVE', 'HOLD', 'DISABLED');

-- AlterTable
ALTER TABLE "hospital_partners" DROP COLUMN "area_locality",
DROP COLUMN "block",
DROP COLUMN "district",
DROP COLUMN "full_address",
DROP COLUMN "pincode",
DROP COLUMN "state";

-- AlterTable
ALTER TABLE "medical_stores" DROP COLUMN "block",
DROP COLUMN "district",
DROP COLUMN "full_address",
DROP COLUMN "pincode",
DROP COLUMN "state",
DROP COLUMN "village_ward";

-- CreateTable
CREATE TABLE "address_book" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "address_type" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "full_address" TEXT NOT NULL,
    "village_ward" TEXT,
    "area_locality" TEXT,
    "block" TEXT,
    "district" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "hospital_partner_id" TEXT,
    "medical_store_id" TEXT,
    "bonchi_mitra_partner_id" TEXT,
    "userId" TEXT,

    CONSTRAINT "address_book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bonchi_mitra_partners" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_by_user_id" TEXT,
    "aadhaar_number" TEXT NOT NULL,
    "pan_number" TEXT NOT NULL,
    "live_photo_url" TEXT,
    "shop_photo_url" TEXT,
    "shop_centre_name" TEXT NOT NULL,
    "business_types" "BusinessType"[],
    "business_other" TEXT,
    "reporting_district_manager" TEXT,
    "agent_code" TEXT NOT NULL,
    "area_type" "AreaType",
    "bank_account_holder_name" TEXT NOT NULL,
    "bank_account_number" TEXT NOT NULL,
    "bank_ifsc_code" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "upi_id" TEXT,
    "agent_agreement_accepted" BOOLEAN NOT NULL DEFAULT false,
    "commission_structure_accepted" BOOLEAN NOT NULL DEFAULT false,
    "data_privacy_consent" BOOLEAN NOT NULL DEFAULT false,
    "kyc_status" "KYCStatus" NOT NULL DEFAULT 'PENDING',
    "agent_status" "AgentStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "bonchi_mitra_partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "band_details" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "bank_account_holder_name" TEXT NOT NULL,
    "bank_account_number" TEXT NOT NULL,
    "bank_ifsc_code" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "upi_id" TEXT,

    CONSTRAINT "band_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "address_book_hospital_partner_id_idx" ON "address_book"("hospital_partner_id");

-- CreateIndex
CREATE INDEX "address_book_medical_store_id_idx" ON "address_book"("medical_store_id");

-- CreateIndex
CREATE INDEX "address_book_bonchi_mitra_partner_id_idx" ON "address_book"("bonchi_mitra_partner_id");

-- CreateIndex
CREATE UNIQUE INDEX "bonchi_mitra_partners_user_id_key" ON "bonchi_mitra_partners"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bonchi_mitra_partners_aadhaar_number_key" ON "bonchi_mitra_partners"("aadhaar_number");

-- CreateIndex
CREATE UNIQUE INDEX "bonchi_mitra_partners_pan_number_key" ON "bonchi_mitra_partners"("pan_number");

-- CreateIndex
CREATE UNIQUE INDEX "bonchi_mitra_partners_agent_code_key" ON "bonchi_mitra_partners"("agent_code");

-- CreateIndex
CREATE INDEX "bonchi_mitra_partners_user_id_idx" ON "bonchi_mitra_partners"("user_id");

-- CreateIndex
CREATE INDEX "bonchi_mitra_partners_agent_code_idx" ON "bonchi_mitra_partners"("agent_code");

-- AddForeignKey
ALTER TABLE "address_book" ADD CONSTRAINT "address_book_hospital_partner_id_fkey" FOREIGN KEY ("hospital_partner_id") REFERENCES "hospital_partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address_book" ADD CONSTRAINT "address_book_medical_store_id_fkey" FOREIGN KEY ("medical_store_id") REFERENCES "medical_stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address_book" ADD CONSTRAINT "address_book_bonchi_mitra_partner_id_fkey" FOREIGN KEY ("bonchi_mitra_partner_id") REFERENCES "bonchi_mitra_partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address_book" ADD CONSTRAINT "address_book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonchi_mitra_partners" ADD CONSTRAINT "bonchi_mitra_partners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonchi_mitra_partners" ADD CONSTRAINT "bonchi_mitra_partners_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "band_details" ADD CONSTRAINT "band_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
