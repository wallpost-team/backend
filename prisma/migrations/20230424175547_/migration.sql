/*
  Warnings:

  - You are about to drop the `UserSocialProvider` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `provider` on the `Wall` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SocialProvider" AS ENUM ('VKONTAKTE');

-- DropForeignKey
ALTER TABLE "UserSocialProvider" DROP CONSTRAINT "UserSocialProvider_userId_fkey";

-- AlterTable
ALTER TABLE "Wall" DROP COLUMN "provider",
ADD COLUMN     "provider" "SocialProvider" NOT NULL;

-- DropTable
DROP TABLE "UserSocialProvider";

-- DropEnum
DROP TYPE "Provider";

-- CreateTable
CREATE TABLE "UserSocialProviderProfile" (
    "id" SERIAL NOT NULL,
    "provider" "SocialProvider" NOT NULL,
    "providerId" INTEGER NOT NULL,
    "tokenDetails" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserSocialProviderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSocialProviderProfile_userId_provider_key" ON "UserSocialProviderProfile"("userId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "UserSocialProviderProfile_providerId_provider_key" ON "UserSocialProviderProfile"("providerId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "Wall_providerWallId_provider_key" ON "Wall"("providerWallId", "provider");

-- AddForeignKey
ALTER TABLE "UserSocialProviderProfile" ADD CONSTRAINT "UserSocialProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
