/*
  Warnings:

  - You are about to drop the column `address` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `hospital_address` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `hospital_registration_number` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `hospital_type` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `is_otp_verified` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `license_number` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `medical_services_offered` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `mobile` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `hospital_partners` table. All the data in the column will be lost.
  - You are about to drop the column `specialties_available` on the `hospital_partners` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `hospital_partners` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registration_number]` on the table `hospital_partners` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contact_person_name` to the `hospital_partners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_address` to the `hospital_partners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile_number` to the `hospital_partners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration_number` to the `hospital_partners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `hospital_partners` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HospitalType" AS ENUM ('MULTISPECIALITY_HOSPITAL', 'NURSING_HOME', 'CLINIC', 'DIAGNOSTIC_CENTRE');

-- CreateEnum
CREATE TYPE "MedicalService" AS ENUM ('OPD_CONSULTATION', 'IPD_ADMISSION', 'SURGERY_OPERATION', 'DIAGNOSTIC_PATHOLOGY', 'EMERGENCY_SERVICES');

-- CreateEnum
CREATE TYPE "MedicalSpecialty" AS ENUM ('MEDICINE', 'SURGERY', 'ORTHOPAEDIC', 'GYNAECOLOGY', 'PAEDIATRICS', 'ENT', 'EYE', 'DENTAL', 'OTHER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRoles" ADD VALUE 'HEALTH_ASSISTANT';
ALTER TYPE "UserRoles" ADD VALUE 'MEDICAL_STORE';

-- DropIndex
DROP INDEX "hospital_partners_email_idx";

-- DropIndex
DROP INDEX "hospital_partners_email_key";

-- DropIndex
DROP INDEX "hospital_partners_hospital_registration_number_key";

-- DropIndex
DROP INDEX "hospital_partners_license_number_key";

-- DropIndex
DROP INDEX "hospital_partners_mobile_key";

-- AlterTable
ALTER TABLE "hospital_partners" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "hospital_address",
DROP COLUMN "hospital_registration_number",
DROP COLUMN "hospital_type",
DROP COLUMN "is_otp_verified",
DROP COLUMN "license_number",
DROP COLUMN "medical_services_offered",
DROP COLUMN "mobile",
DROP COLUMN "password",
DROP COLUMN "specialties_available",
ADD COLUMN     "alternate_mobile_number" TEXT,
ADD COLUMN     "area_locality" TEXT,
ADD COLUMN     "block" TEXT,
ADD COLUMN     "contact_person_name" TEXT NOT NULL,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "diagnostic_discount" INTEGER,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "free_services" TEXT,
ADD COLUMN     "full_address" TEXT NOT NULL,
ADD COLUMN     "hospital_types" "HospitalType"[],
ADD COLUMN     "medical_services" "MedicalService"[],
ADD COLUMN     "mobile_number" TEXT NOT NULL,
ADD COLUMN     "opd_discount" INTEGER,
ADD COLUMN     "registration_number" TEXT NOT NULL,
ADD COLUMN     "specialties" "MedicalSpecialty"[],
ADD COLUMN     "specialty_other" TEXT,
ADD COLUMN     "surgery_discount" INTEGER,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "hospital_partners_user_id_key" ON "hospital_partners"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_partners_registration_number_key" ON "hospital_partners"("registration_number");

-- CreateIndex
CREATE INDEX "hospital_partners_user_id_idx" ON "hospital_partners"("user_id");

-- AddForeignKey
ALTER TABLE "hospital_partners" ADD CONSTRAINT "hospital_partners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
