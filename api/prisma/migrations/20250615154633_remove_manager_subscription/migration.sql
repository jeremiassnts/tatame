/*
  Warnings:

  - You are about to drop the column `tier` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `ManagerSubscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ManagerSubscription" DROP CONSTRAINT "ManagerSubscription_userId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "tier";

-- DropTable
DROP TABLE "ManagerSubscription";
