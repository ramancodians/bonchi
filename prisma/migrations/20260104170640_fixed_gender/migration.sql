-- AlterEnum
ALTER TYPE "Gender" ADD VALUE 'UNKNOWN';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "gender" SET DEFAULT 'UNKNOWN';
