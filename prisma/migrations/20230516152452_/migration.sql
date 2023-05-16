/*
  Warnings:

  - The primary key for the `LikesOnPosts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorId` on the `LikesOnPosts` table. All the data in the column will be lost.
  - You are about to drop the column `account_id` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[author_id]` on the table `LikesOnPosts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[author_id]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author_id` to the `LikesOnPosts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LikesOnPosts" DROP CONSTRAINT "LikesOnPosts_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_account_id_fkey";

-- DropIndex
DROP INDEX "LikesOnPosts_authorId_key";

-- DropIndex
DROP INDEX "Post_account_id_key";

-- AlterTable
ALTER TABLE "LikesOnPosts" DROP CONSTRAINT "LikesOnPosts_pkey",
DROP COLUMN "authorId",
ADD COLUMN     "author_id" INTEGER NOT NULL,
ADD CONSTRAINT "LikesOnPosts_pkey" PRIMARY KEY ("id", "post_id", "author_id");

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "account_id",
ADD COLUMN     "author_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LikesOnPosts_author_id_key" ON "LikesOnPosts"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "Post_author_id_key" ON "Post"("author_id");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnPosts" ADD CONSTRAINT "LikesOnPosts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
