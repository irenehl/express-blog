/*
  Warnings:

  - The primary key for the `LikesOnComments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorId` on the `LikesOnComments` table. All the data in the column will be lost.
  - You are about to drop the column `commentId` on the `LikesOnComments` table. All the data in the column will be lost.
  - The primary key for the `Report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `commentId` on the `Report` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[comment_id]` on the table `Report` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author_id` to the `LikesOnComments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comment_id` to the `LikesOnComments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comment_id` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LikesOnComments" DROP CONSTRAINT "LikesOnComments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnComments" DROP CONSTRAINT "LikesOnComments_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_commentId_fkey";

-- DropIndex
DROP INDEX "Report_commentId_key";

-- AlterTable
ALTER TABLE "LikesOnComments" DROP CONSTRAINT "LikesOnComments_pkey",
DROP COLUMN "authorId",
DROP COLUMN "commentId",
ADD COLUMN     "author_id" INTEGER NOT NULL,
ADD COLUMN     "comment_id" INTEGER NOT NULL,
ADD CONSTRAINT "LikesOnComments_pkey" PRIMARY KEY ("id", "author_id", "comment_id");

-- AlterTable
ALTER TABLE "Report" DROP CONSTRAINT "Report_pkey",
DROP COLUMN "authorId",
DROP COLUMN "commentId",
ADD COLUMN     "author_id" INTEGER NOT NULL,
ADD COLUMN     "comment_id" INTEGER NOT NULL,
ADD CONSTRAINT "Report_pkey" PRIMARY KEY ("id", "author_id", "comment_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Report_comment_id_key" ON "Report"("comment_id");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnComments" ADD CONSTRAINT "LikesOnComments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnComments" ADD CONSTRAINT "LikesOnComments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
