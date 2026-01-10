-- AlterEnum
ALTER TYPE "UserRoles" ADD VALUE 'DISTRICT_CORDINATOR';

-- AlterTable
ALTER TABLE "bonchi_cards" ADD COLUMN     "activation_date" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE "agent_created_users" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agent_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "health_card_id" TEXT,
    "commission_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "status" TEXT NOT NULL DEFAULT 'activated',

    CONSTRAINT "agent_created_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_settings" (
    "id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "registration_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "card_activation_fee" DECIMAL(10,2) NOT NULL DEFAULT 100.00,
    "agent_commission_percentage" DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    "min_wallet_balance" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "updated_by" TEXT,

    CONSTRAINT "agent_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_transactions" (
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

    CONSTRAINT "agent_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_wallets" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "agent_id" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "total_earned" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "total_spent" DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "agent_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district_coordinators" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "assigned_districts" TEXT[],
    "employee_id" TEXT,
    "official_email" TEXT,
    "official_phone" TEXT,
    "status" "AgentStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "district_coordinators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_assistants" (
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

    CONSTRAINT "health_assistants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
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

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agent_created_users_user_id_key" ON "agent_created_users"("user_id");

-- CreateIndex
CREATE INDEX "agent_created_users_agent_id_idx" ON "agent_created_users"("agent_id");

-- CreateIndex
CREATE INDEX "agent_created_users_user_id_idx" ON "agent_created_users"("user_id");

-- CreateIndex
CREATE INDEX "agent_transactions_agent_id_idx" ON "agent_transactions"("agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "agent_wallets_agent_id_key" ON "agent_wallets"("agent_id");

-- CreateIndex
CREATE INDEX "agent_wallets_agent_id_idx" ON "agent_wallets"("agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "district_coordinators_user_id_key" ON "district_coordinators"("user_id");

-- CreateIndex
CREATE INDEX "district_coordinators_user_id_idx" ON "district_coordinators"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "health_assistants_user_id_key" ON "health_assistants"("user_id");

-- CreateIndex
CREATE INDEX "health_assistants_user_id_idx" ON "health_assistants"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_payment_id_key" ON "payments"("payment_id");

-- CreateIndex
CREATE INDEX "payments_payment_id_idx" ON "payments"("payment_id");

-- CreateIndex
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- AddForeignKey
ALTER TABLE "agent_created_users" ADD CONSTRAINT "agent_created_users_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "bonchi_mitra_partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_created_users" ADD CONSTRAINT "agent_created_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_transactions" ADD CONSTRAINT "agent_transactions_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "bonchi_mitra_partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_wallets" ADD CONSTRAINT "agent_wallets_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "bonchi_mitra_partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "district_coordinators" ADD CONSTRAINT "district_coordinators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_assistants" ADD CONSTRAINT "health_assistants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bonchi_card_id_fkey" FOREIGN KEY ("bonchi_card_id") REFERENCES "bonchi_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
