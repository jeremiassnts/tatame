/*
  Warnings:

  - The required column `id` was added to the `UserRole` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "UserRole_role_key";

-- DropIndex
DROP INDEX "UserRole_userId_key";

-- AlterTable
ALTER TABLE "UserRole" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id");
