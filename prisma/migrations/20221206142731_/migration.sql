/*
  Warnings:

  - Changed the type of `discordId` on the `DiscordProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DiscordProfile" DROP COLUMN "discordId",
ADD COLUMN     "discordId" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DiscordProfile_discordId_key" ON "DiscordProfile"("discordId");
