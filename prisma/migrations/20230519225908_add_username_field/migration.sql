/*
  Warnings:

  - You are about to drop the `LikesOnComments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LikesOnPosts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `username` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Reactions" AS ENUM ('LIKE', 'DISLIKE', 'LOVE', 'ANGRY', 'FUNNY');

-- DropForeignKey
ALTER TABLE "LikesOnComments" DROP CONSTRAINT "LikesOnComments_author_id_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnComments" DROP CONSTRAINT "LikesOnComments_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnPosts" DROP CONSTRAINT "LikesOnPosts_author_id_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnPosts" DROP CONSTRAINT "LikesOnPosts_post_id_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "username" VARCHAR(50) NOT NULL;

-- DropTable
DROP TABLE "LikesOnComments";

-- DropTable
DROP TABLE "LikesOnPosts";

-- CreateTable
CREATE TABLE "ReactionsOnComments" (
    "id" SERIAL NOT NULL,
    "reaction" "Reactions" NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "ReactionsOnComments_pkey" PRIMARY KEY ("id","author_id","comment_id")
);

-- CreateTable
CREATE TABLE "ReactionsOnPosts" (
    "id" SERIAL NOT NULL,
    "reaction" "Reactions" NOT NULL,
    "post_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "ReactionsOnPosts_pkey" PRIMARY KEY ("id","post_id","author_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReactionsOnComments_id_key" ON "ReactionsOnComments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ReactionsOnPosts_id_key" ON "ReactionsOnPosts"("id");

-- AddForeignKey
ALTER TABLE "ReactionsOnComments" ADD CONSTRAINT "ReactionsOnComments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionsOnComments" ADD CONSTRAINT "ReactionsOnComments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionsOnPosts" ADD CONSTRAINT "ReactionsOnPosts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionsOnPosts" ADD CONSTRAINT "ReactionsOnPosts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
