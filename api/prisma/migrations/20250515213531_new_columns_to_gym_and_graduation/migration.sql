/*
  Warnings:

  - Added the required column `logo` to the `gyms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Graduation" ADD COLUMN     "extraInfo" TEXT;

-- AlterTable
ALTER TABLE "gyms" ADD COLUMN     "logo" TEXT NOT NULL,
ADD COLUMN     "since" TIMESTAMP(3);
