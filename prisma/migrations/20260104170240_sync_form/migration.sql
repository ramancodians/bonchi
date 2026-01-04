/*
  Warnings:

  - You are about to drop the column `guardianName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `illness` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "guardianName",
DROP COLUMN "illness",
DROP COLUMN "name",
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "email" TEXT,
ADD COLUMN     "first_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "guardian_name" TEXT,
ADD COLUMN     "last_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "password" TEXT,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "village" DROP NOT NULL,
ALTER COLUMN "block" DROP NOT NULL,
ALTER COLUMN "district" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "ayushmanCardAvailable" DROP NOT NULL,
ALTER COLUMN "customerConsent" SET DEFAULT false,
ALTER COLUMN "termsAccepted" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");
