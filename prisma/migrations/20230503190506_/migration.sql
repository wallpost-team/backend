/*
  Warnings:

  - Changed the type of `providerWallId` on the `Wall` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Wall" DROP COLUMN "providerWallId",
ADD COLUMN     "providerWallId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Wall_providerWallId_provider_key" ON "Wall"("providerWallId", "provider");
