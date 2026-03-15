-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'ICLOUD');

-- CreateEnum
CREATE TYPE "InternalRole" AS ENUM ('ADMIN', 'HOST', 'SECURITY');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'REJECTED', 'CANCELLED', 'EXTENDED');

-- CreateEnum
CREATE TYPE "QRStatus" AS ENUM ('PENDING', 'ACTIVE', 'USED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('INITIAL', 'ADDITIONAL');

-- CreateEnum
CREATE TYPE "AccessSource" AS ENUM ('SECURITY', 'KIOSK', 'WEB');

-- CreateEnum
CREATE TYPE "LogAction" AS ENUM ('ENTRY', 'EXIT');

ALTER TABLE "User" RENAME TO "users";
ALTER TABLE "users" RENAME COLUMN "name" TO "full_name";
ALTER TABLE "users" RENAME COLUMN "googleId" TO "google_id";
ALTER TABLE "users" RENAME COLUMN "passwordHash" TO "password_hash";
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";

ALTER INDEX "User_pkey" RENAME TO "users_pkey";
ALTER INDEX "User_email_key" RENAME TO "users_email_key";
ALTER INDEX "User_googleId_key" RENAME TO "users_google_id_key";

ALTER TABLE "users"
    ADD COLUMN "phone" TEXT,
    ADD COLUMN "company" TEXT,
    ADD COLUMN "auth_provider" "AuthProvider",
    ADD COLUMN "icloud_id" TEXT,
    ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "users"
SET "auth_provider" = 'GOOGLE'
WHERE "auth_provider" IS NULL;

ALTER TABLE "users"
    ALTER COLUMN "auth_provider" SET NOT NULL;

-- CreateTable
CREATE TABLE "internal_users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
        "password_hash" TEXT,
    "role" "InternalRole" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "failed_login_count" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "internal_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "host_employees" (
    "id" TEXT NOT NULL,
    "internal_user_id" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "building_id" TEXT NOT NULL,

    CONSTRAINT "host_employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "operating_start" TEXT NOT NULL,
    "operating_end" TEXT NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_posts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coordinate" TEXT NOT NULL,

    CONSTRAINT "security_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "host_id" TEXT NOT NULL,
    "building_id" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "visit_date" TIMESTAMP(3) NOT NULL,
    "visit_time" TEXT NOT NULL,
    "visit_end_time" TEXT NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "is_group" BOOLEAN NOT NULL DEFAULT false,
    "approval_note" TEXT,
    "approved_at" TIMESTAMP(3),
    "approved_by" TEXT,
    "reservation_code" TEXT NOT NULL,
    "parent_reservation_id" TEXT,
    "is_extension" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_visitors" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "user_id" TEXT,
    "full_name" TEXT NOT NULL,
    "is_representative" BOOLEAN NOT NULL DEFAULT false,
    "identity_number" TEXT,

    CONSTRAINT "reservation_visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_codes" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "qr_token" TEXT NOT NULL,
    "security_post_id" TEXT NOT NULL,
    "target_building_id" TEXT NOT NULL,
    "status" "QRStatus" NOT NULL DEFAULT 'PENDING',
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "email_sent" BOOLEAN NOT NULL DEFAULT false,
    "email_sent_at" TIMESTAMP(3),

    CONSTRAINT "qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_building_access" (
    "id" TEXT NOT NULL,
    "qr_code_id" TEXT NOT NULL,
    "building_id" TEXT NOT NULL,
    "host_id" TEXT,
    "purpose" TEXT NOT NULL,
    "access_type" "AccessType" NOT NULL,
    "source" "AccessSource" NOT NULL,
    "visit_start" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qr_building_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "security_post_id" TEXT NOT NULL,
    "checked_by" TEXT NOT NULL,
    "host_name_input" TEXT NOT NULL,
    "building_input" TEXT NOT NULL,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_logs" (
    "id" TEXT NOT NULL,
    "qr_code_id" TEXT NOT NULL,
    "building_id" TEXT NOT NULL,
    "door_id" TEXT NOT NULL,
    "scanned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" "LogAction" NOT NULL,

    CONSTRAINT "visitor_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_users" (
    "id" TEXT NOT NULL,
    "internal_user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "security_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_icloud_id_key" ON "users"("icloud_id");

-- CreateIndex
CREATE UNIQUE INDEX "internal_users_email_key" ON "internal_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "host_employees_internal_user_id_key" ON "host_employees"("internal_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_reservation_code_key" ON "reservations"("reservation_code");

-- CreateIndex
CREATE UNIQUE INDEX "qr_codes_qr_token_key" ON "qr_codes"("qr_token");

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_reservation_id_key" ON "check_ins"("reservation_id");

-- CreateIndex
CREATE UNIQUE INDEX "security_users_internal_user_id_key" ON "security_users"("internal_user_id");

INSERT INTO "internal_users" (
        "id",
        "full_name",
        "email",
        "password_hash",
        "role",
        "is_active",
        "failed_login_count",
        "locked_until",
        "last_login_at",
        "created_at",
        "updated_at"
)
SELECT
        "id",
        COALESCE("full_name", "email"),
        "email",
        "password_hash",
        "role"::text::"InternalRole",
        TRUE,
        0,
        NULL,
        NULL,
        "created_at",
        CURRENT_TIMESTAMP
FROM "users"
WHERE "role"::text IN ('ADMIN', 'HOST', 'SECURITY');

DELETE FROM "users"
WHERE "role"::text IN ('ADMIN', 'HOST', 'SECURITY');

ALTER TABLE "users"
    DROP COLUMN "password_hash",
    DROP COLUMN "role";

DROP TYPE "Role";

-- AddForeignKey
ALTER TABLE "host_employees" ADD CONSTRAINT "host_employees_internal_user_id_fkey" FOREIGN KEY ("internal_user_id") REFERENCES "internal_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "host_employees" ADD CONSTRAINT "host_employees_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "host_employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "internal_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_parent_reservation_id_fkey" FOREIGN KEY ("parent_reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_visitors" ADD CONSTRAINT "reservation_visitors_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_visitors" ADD CONSTRAINT "reservation_visitors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "reservation_visitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_security_post_id_fkey" FOREIGN KEY ("security_post_id") REFERENCES "security_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_target_building_id_fkey" FOREIGN KEY ("target_building_id") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_building_access" ADD CONSTRAINT "qr_building_access_qr_code_id_fkey" FOREIGN KEY ("qr_code_id") REFERENCES "qr_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_building_access" ADD CONSTRAINT "qr_building_access_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_building_access" ADD CONSTRAINT "qr_building_access_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "host_employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_security_post_id_fkey" FOREIGN KEY ("security_post_id") REFERENCES "security_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_checked_by_fkey" FOREIGN KEY ("checked_by") REFERENCES "internal_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_logs" ADD CONSTRAINT "visitor_logs_qr_code_id_fkey" FOREIGN KEY ("qr_code_id") REFERENCES "qr_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_logs" ADD CONSTRAINT "visitor_logs_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_users" ADD CONSTRAINT "security_users_internal_user_id_fkey" FOREIGN KEY ("internal_user_id") REFERENCES "internal_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_users" ADD CONSTRAINT "security_users_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "security_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
