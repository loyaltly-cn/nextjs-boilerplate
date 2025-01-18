/*
  Warnings:

  - The values [INTENDED_PARENT,SURROGATE_MOTHER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `type` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "Message" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Message" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "Message" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "SurrogateMotherApplication" ALTER COLUMN "hasChildren" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "type" TEXT NOT NULL;
