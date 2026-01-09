-- CreateTable
CREATE TABLE "medical_stores" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_by_user_id" TEXT,
    "store_name" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "drug_license_number" TEXT NOT NULL,
    "gst_number" TEXT,
    "mobile_number" TEXT NOT NULL,
    "alternate_mobile_number" TEXT,
    "email" TEXT,
    "full_address" TEXT NOT NULL,
    "village_ward" TEXT,
    "block" TEXT,
    "district" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "medicine_discount" INTEGER,
    "generic_medicine_discount" INTEGER,
    "home_delivery_available" BOOLEAN NOT NULL DEFAULT false,
    "bonchi_healthcard_accepted" BOOLEAN NOT NULL DEFAULT true,
    "display_partner_board" BOOLEAN NOT NULL DEFAULT true,
    "drug_license_copy_url" TEXT,
    "store_photo_url" TEXT,
    "owner_aadhaar_pan_url" TEXT,
    "discount_agreement_consent" BOOLEAN NOT NULL DEFAULT false,
    "insurance_understanding" BOOLEAN NOT NULL DEFAULT false,
    "terms_accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "medical_stores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medical_stores_user_id_key" ON "medical_stores"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "medical_stores_drug_license_number_key" ON "medical_stores"("drug_license_number");

-- CreateIndex
CREATE INDEX "medical_stores_user_id_idx" ON "medical_stores"("user_id");

-- AddForeignKey
ALTER TABLE "medical_stores" ADD CONSTRAINT "medical_stores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_stores" ADD CONSTRAINT "medical_stores_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
