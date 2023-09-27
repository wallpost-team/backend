-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('VKONTAKTE');

-- CreateTable
CREATE TABLE "UserSocialProvider" (
    "id" SERIAL NOT NULL,
    "provider" "Provider" NOT NULL,
    "providerProfileId" INTEGER NOT NULL,
    "tokenDetails" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserSocialProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "joinedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "wallId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wall" (
    "id" TEXT NOT NULL,
    "providerWallId" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,

    CONSTRAINT "Wall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "providerPostId" TEXT NOT NULL,
    "wallId" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSocialProvider_userId_provider_key" ON "UserSocialProvider"("userId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "UserSocialProvider_providerProfileId_provider_key" ON "UserSocialProvider"("providerProfileId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "Wall_providerWallId_provider_key" ON "Wall"("providerWallId", "provider");

-- AddForeignKey
ALTER TABLE "UserSocialProvider" ADD CONSTRAINT "UserSocialProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_wallId_fkey" FOREIGN KEY ("wallId") REFERENCES "Wall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_wallId_fkey" FOREIGN KEY ("wallId") REFERENCES "Wall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
