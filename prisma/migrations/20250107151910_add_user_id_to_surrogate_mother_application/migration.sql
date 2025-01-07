/*
  Warnings:

  - Added the required column `userId` to the `SurrogateMotherApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SurrogateMotherApplication" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SurrogateMotherApplication" ADD CONSTRAINT "SurrogateMotherApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
