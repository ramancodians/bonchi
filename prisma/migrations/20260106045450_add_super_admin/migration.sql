-- CreateTable
CREATE TABLE "hospital_partners" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "hospital_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "hospital_type" TEXT,
    "hospital_registration_number" TEXT,
    "year_of_establishment" INTEGER,
    "mobile" TEXT NOT NULL,
    "is_otp_verified" BOOLEAN NOT NULL DEFAULT false,
    "medical_services_offered" TEXT,
    "specialties_available" TEXT,
    "hospital_address" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,

    CONSTRAINT "hospital_partners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hospital_partners_email_key" ON "hospital_partners"("email");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_partners_hospital_registration_number_key" ON "hospital_partners"("hospital_registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_partners_mobile_key" ON "hospital_partners"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_partners_license_number_key" ON "hospital_partners"("license_number");

-- CreateIndex
CREATE INDEX "hospital_partners_email_idx" ON "hospital_partners"("email");
