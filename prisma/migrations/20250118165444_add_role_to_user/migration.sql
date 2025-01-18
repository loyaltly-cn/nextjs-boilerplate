/*
  Warnings:

  - Added the required column `type` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'INTENDED_PARENT';
ALTER TYPE "Role" ADD VALUE 'SURROGATE_MOTHER';

-- -- AlterTable
-- ALTER TABLE "SurrogateMotherApplication" ALTER COLUMN "hasChildren" SET DATA TYPE TEXT;

-- -- AlterTable
-- ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'INTENDED_PARENT';

-- -- AlterTable
-- ALTER TABLE "appointments" ADD COLUMN     "type" TEXT NOT NULL;
