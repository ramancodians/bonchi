/*
  Warnings:

  - You are about to drop the `agent_created_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `agent_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `agent_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `agent_wallets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `district_coordinators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `health_assistants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "agent_created_users" DROP CONSTRAINT "agent_created_users_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "agent_created_users" DROP CONSTRAINT "agent_created_users_user_id_fkey";

-- DropForeignKey
ALTER TABLE "agent_transactions" DROP CONSTRAINT "agent_transactions_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "agent_wallets" DROP CONSTRAINT "agent_wallets_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "district_coordinators" DROP CONSTRAINT "district_coordinators_user_id_fkey";

-- DropForeignKey
ALTER TABLE "health_assistants" DROP CONSTRAINT "health_assistants_user_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_bonchi_card_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_user_id_fkey";

-- DropTable
DROP TABLE "agent_created_users";

-- DropTable
DROP TABLE "agent_settings";

-- DropTable
DROP TABLE "agent_transactions";

-- DropTable
DROP TABLE "agent_wallets";

-- DropTable
DROP TABLE "district_coordinators";

-- DropTable
DROP TABLE "health_assistants";

-- DropTable
DROP TABLE "payments";

-- CreateTable
CREATE TABLE "AgentCreatedUsers" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agent_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "health_card_id" TEXT,
    "commission_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "status" TEXT NOT NULL DEFAULT 'activated',

    CONSTRAINT "AgentCreatedUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "registration_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "card_activation_fee" DECIMAL(10,2) NOT NULL DEFAULT 100.00,
    "agent_commission_percentage" DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    "min_wallet_balance" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "updated_by" TEXT,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentTransactions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agent_id" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "reference_type" TEXT,
    "reference_id" TEXT,
    "balance_before" DECIMAL(10,2) NOT NULL,
    "balance_after" DECIMAL(10,2) NOT NULL,
    "performed_by" TEXT,

    CONSTRAINT "AgentTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentWallets" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "agent_id" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "total_earned" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "total_spent" DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "AgentWallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistrictCoordinators" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "assigned_districts" TEXT[],
    "employee_id" TEXT,
    "official_email" TEXT,
    "official_phone" TEXT,
    "status" "AgentStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "DistrictCoordinators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthAssistants" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "gender" "Gender",
    "aadhaar_number" TEXT,
    "profession" TEXT,
    "qualification" TEXT,
    "specialization" TEXT,
    "experience_years" INTEGER,
    "address" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "HealthAssistants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "bonchi_card_id" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "payment_id" TEXT NOT NULL,
    "order_id" TEXT,
    "status" TEXT NOT NULL,
    "payment_type" TEXT NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentCreatedUsers_user_id_key" ON "AgentCreatedUsers"("user_id");

-- CreateIndex
CREATE INDEX "AgentCreatedUsers_agent_id_idx" ON "AgentCreatedUsers"("agent_id");

-- CreateIndex
CREATE INDEX "AgentCreatedUsers_user_id_idx" ON "AgentCreatedUsers"("user_id");

-- CreateIndex
CREATE INDEX "AgentTransactions_agent_id_idx" ON "AgentTransactions"("agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "AgentWallets_agent_id_key" ON "AgentWallets"("agent_id");

-- CreateIndex
CREATE INDEX "AgentWallets_agent_id_idx" ON "AgentWallets"("agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "DistrictCoordinators_user_id_key" ON "DistrictCoordinators"("user_id");

-- CreateIndex
CREATE INDEX "DistrictCoordinators_user_id_idx" ON "DistrictCoordinators"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "HealthAssistants_user_id_key" ON "HealthAssistants"("user_id");

-- CreateIndex
CREATE INDEX "HealthAssistants_user_id_idx" ON "HealthAssistants"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_payment_id_key" ON "Payments"("payment_id");

-- CreateIndex
CREATE INDEX "Payments_payment_id_idx" ON "Payments"("payment_id");

-- CreateIndex
CREATE INDEX "Payments_user_id_idx" ON "Payments"("user_id");

-- AddForeignKey
ALTER TABLE "AgentCreatedUsers" ADD CONSTRAINT "AgentCreatedUsers_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "bonchi_mitra_partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentCreatedUsers" ADD CONSTRAINT "AgentCreatedUsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentTransactions" ADD CONSTRAINT "AgentTransactions_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "bonchi_mitra_partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentWallets" ADD CONSTRAINT "AgentWallets_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "bonchi_mitra_partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistrictCoordinators" ADD CONSTRAINT "DistrictCoordinators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthAssistants" ADD CONSTRAINT "HealthAssistants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_bonchi_card_id_fkey" FOREIGN KEY ("bonchi_card_id") REFERENCES "bonchi_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
