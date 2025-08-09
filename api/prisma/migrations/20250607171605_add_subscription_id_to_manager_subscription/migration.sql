/*
  Warnings:

  - Added the required column `subscriptionId` to the `ManagerSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ManagerSubscription" ADD COLUMN     "subscriptionId" TEXT NOT NULL;
