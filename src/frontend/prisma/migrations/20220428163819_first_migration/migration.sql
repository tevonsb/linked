-- CreateTable
CREATE TABLE "link" (
    "id" UUID NOT NULL,
    "encryptedlink" TEXT NOT NULL,
    "condition" JSON,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "status" CHAR(1),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
