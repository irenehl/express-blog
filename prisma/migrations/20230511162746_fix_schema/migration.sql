/*
  Warnings:

  - You are about to drop the `AccountsOnComments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccountsOnPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LikesOnPublication` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[accountId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccountsOnComments" DROP CONSTRAINT "AccountsOnComments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "AccountsOnComments" DROP CONSTRAINT "AccountsOnComments_commentId_fkey";

-- DropForeignKey
ALTER TABLE "AccountsOnPosts" DROP CONSTRAINT "AccountsOnPosts_accountId_fkey";

-- DropForeignKey
ALTER TABLE "AccountsOnPosts" DROP CONSTRAINT "AccountsOnPosts_postId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnPublication" DROP CONSTRAINT "LikesOnPublication_authorId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnPublication" DROP CONSTRAINT "LikesOnPublication_commentId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnPublication" DROP CONSTRAINT "LikesOnPublication_postId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "accountId" INTEGER NOT NULL,
ADD COLUMN     "postId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "accountId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "AccountsOnComments";

-- DropTable
DROP TABLE "AccountsOnPosts";

-- DropTable
DROP TABLE "LikesOnPublication";

-- CreateTable
CREATE TABLE "LikesOnComments" (
    "id" SERIAL NOT NULL,
    "commentId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "LikesOnComments_pkey" PRIMARY KEY ("id","authorId","commentId")
);

-- CreateTable
CREATE TABLE "LikesOnPosts" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "LikesOnPosts_pkey" PRIMARY KEY ("id","postId","authorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "LikesOnComments_id_key" ON "LikesOnComments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LikesOnPosts_id_key" ON "LikesOnPosts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LikesOnPosts_authorId_key" ON "LikesOnPosts"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_accountId_key" ON "Comment"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_accountId_key" ON "Post"("accountId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnComments" ADD CONSTRAINT "LikesOnComments_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnComments" ADD CONSTRAINT "LikesOnComments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnPosts" ADD CONSTRAINT "LikesOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnPosts" ADD CONSTRAINT "LikesOnPosts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
