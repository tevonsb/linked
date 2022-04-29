/*
  Warnings:

  - You are about to drop the `listAccess` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "listAccess";

-- CreateTable
CREATE TABLE "linkAccess" (
    "id" UUID NOT NULL,
    "linkId" UUID NOT NULL,
    "accessOutcome" TEXT NOT NULL,
    "accessAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "linkAccess_pkey" PRIMARY KEY ("id")
);
