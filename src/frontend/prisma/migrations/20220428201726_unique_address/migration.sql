/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "address_address_key" ON "address"("address");
