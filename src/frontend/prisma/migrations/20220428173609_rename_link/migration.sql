/*
  Warnings:

  - You are about to drop the column `encryptedlink` on the `link` table. All the data in the column will be lost.
  - Added the required column `encryptedLink` to the `link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "link" DROP COLUMN "encryptedlink",
ADD COLUMN     "encryptedLink" TEXT NOT NULL;
