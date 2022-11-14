/*
  Warnings:

  - You are about to drop the column `discordAccessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `discordId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `discordRefreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[discordProfileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discordProfileId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_discordId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "discordAccessToken",
DROP COLUMN "discordId",
DROP COLUMN "discordRefreshToken",
DROP COLUMN "refreshToken",
ADD COLUMN     "discordProfileId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "DiscordProfile" (
    "id" SERIAL NOT NULL,
    "discordId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,

    CONSTRAINT "DiscordProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordProfile_discordId_key" ON "DiscordProfile"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "User_discordProfileId_key" ON "User"("discordProfileId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_discordProfileId_fkey" FOREIGN KEY ("discordProfileId") REFERENCES "DiscordProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
