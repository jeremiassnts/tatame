/*
  Warnings:

  - Added the required column `reference_date` to the `check_ins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "check_ins" ADD COLUMN     "reference_date" TIMESTAMP(3) NOT NULL;
