/*
  Warnings:

  - You are about to drop the column `accessToken` on the `DiscordProfile` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `DiscordProfile` table. All the data in the column will be lost.
  - Added the required column `tokenDetails` to the `DiscordProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscordProfile" DROP COLUMN "accessToken",
DROP COLUMN "refreshToken",
ADD COLUMN     "tokenDetails" TEXT NOT NULL;
