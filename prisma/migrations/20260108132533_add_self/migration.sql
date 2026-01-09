-- AlterTable
ALTER TABLE "bonchi_mitra_partners" ADD COLUMN     "is_self_registered" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "hospital_partners" ADD COLUMN     "is_self_registered" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "medical_stores" ADD COLUMN     "is_self_registered" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_self_registered" BOOLEAN NOT NULL DEFAULT false;
