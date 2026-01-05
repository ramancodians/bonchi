-- CreateTable
CREATE TABLE "operation_support_forms" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "patient_name" TEXT NOT NULL,
    "age" INTEGER,
    "gender" "Gender" DEFAULT 'OTHER',
    "relationship" TEXT,
    "hospital_name" TEXT,
    "doctor_name" TEXT,
    "expected_surgery_date" TIMESTAMP(3),
    "type_of_surgery" TEXT,
    "estimated_cost" INTEGER,
    "monthly_income" INTEGER,
    "number_of_dependents" INTEGER,
    "has_insurance" BOOLEAN DEFAULT false,
    "required_support_percetage" INTEGER,
    "additional_details" TEXT,
    "is_terms_accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "operation_support_forms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "operation_support_forms_user_id_idx" ON "operation_support_forms"("user_id");

-- AddForeignKey
ALTER TABLE "operation_support_forms" ADD CONSTRAINT "operation_support_forms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
