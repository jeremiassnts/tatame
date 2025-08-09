/*
  Warnings:

  - You are about to drop the column `time` on the `classes` table. All the data in the column will be lost.
  - Added the required column `time_end` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_start` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" DROP COLUMN "time",
ADD COLUMN     "time_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "time_start" TIMESTAMP(3) NOT NULL;
