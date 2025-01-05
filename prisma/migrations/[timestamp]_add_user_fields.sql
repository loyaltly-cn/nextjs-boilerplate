-- AlterTable
ALTER TABLE "User" ADD COLUMN "phoneNumber" TEXT,
                   ADD COLUMN "dateOfBirth" TIMESTAMP(3),
                   ADD COLUMN "city" TEXT,
                   ADD COLUMN "country" TEXT,
                   ADD COLUMN "postalCode" TEXT,
                   ADD COLUMN "address" TEXT; 