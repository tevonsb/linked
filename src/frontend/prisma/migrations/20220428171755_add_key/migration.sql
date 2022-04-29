/*
  Warnings:

  - Added the required column `encryptedKey` to the `link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "link" ADD COLUMN     "encryptedKey" TEXT NOT NULL;
