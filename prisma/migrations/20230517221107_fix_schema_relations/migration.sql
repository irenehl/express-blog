/*
  Warnings:

  - You are about to drop the column `account_id` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_account_id_fkey";

-- DropIndex
DROP INDEX "Comment_account_id_key";

-- DropIndex
DROP INDEX "LikesOnPosts_author_id_key";

-- DropIndex
DROP INDEX "Post_author_id_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "account_id",
ADD COLUMN     "author_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
