/*
  Warnings:

  - You are about to drop the column `managerId` on the `gyms` table. All the data in the column will be lost.
  - You are about to drop the column `authToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profilePhotoUrl` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Graduation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GraduationColor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Modality` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[manager_id]` on the table `gyms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `manager_id` to the `gyms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Graduation" DROP CONSTRAINT "Graduation_colorId_fkey";

-- DropForeignKey
ALTER TABLE "Graduation" DROP CONSTRAINT "Graduation_userId_fkey";

-- DropForeignKey
ALTER TABLE "GraduationColor" DROP CONSTRAINT "GraduationColor_modalityId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- DropForeignKey
ALTER TABLE "gyms" DROP CONSTRAINT "gyms_managerId_fkey";

-- DropIndex
DROP INDEX "gyms_managerId_key";

-- AlterTable
ALTER TABLE "gyms" DROP COLUMN "managerId",
ADD COLUMN     "manager_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "authToken",
DROP COLUMN "profilePhotoUrl",
DROP COLUMN "stripeCustomerId",
ADD COLUMN     "auth_token" TEXT,
ADD COLUMN     "profile_photo_url" TEXT,
ADD COLUMN     "stripe_customer_id" TEXT;

-- DropTable
DROP TABLE "Graduation";

-- DropTable
DROP TABLE "GraduationColor";

-- DropTable
DROP TABLE "Modality";

-- DropTable
DROP TABLE "UserRole";

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modalities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TypeOfGraduation" NOT NULL,

    CONSTRAINT "modalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "graduation_colors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "modality_id" TEXT NOT NULL,

    CONSTRAINT "graduation_colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "graduations" (
    "id" TEXT NOT NULL,
    "extra_info" TEXT,
    "color_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "graduations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_gyms" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "gym_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "training_gyms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gyms_manager_id_key" ON "gyms"("manager_id");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gyms" ADD CONSTRAINT "gyms_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graduation_colors" ADD CONSTRAINT "graduation_colors_modality_id_fkey" FOREIGN KEY ("modality_id") REFERENCES "modalities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graduations" ADD CONSTRAINT "graduations_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "graduation_colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graduations" ADD CONSTRAINT "graduations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_gyms" ADD CONSTRAINT "training_gyms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_gyms" ADD CONSTRAINT "training_gyms_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
