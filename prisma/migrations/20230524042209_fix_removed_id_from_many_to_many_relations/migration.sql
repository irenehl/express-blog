/*
  Warnings:

  - The primary key for the `ReactionsOnComments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ReactionsOnComments` table. All the data in the column will be lost.
  - The primary key for the `ReactionsOnPosts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ReactionsOnPosts` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ReactionsOnComments_id_key";

-- DropIndex
DROP INDEX "ReactionsOnPosts_id_key";

-- AlterTable
ALTER TABLE "ReactionsOnComments" DROP CONSTRAINT "ReactionsOnComments_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ReactionsOnComments_pkey" PRIMARY KEY ("author_id", "comment_id");

-- AlterTable
ALTER TABLE "ReactionsOnPosts" DROP CONSTRAINT "ReactionsOnPosts_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ReactionsOnPosts_pkey" PRIMARY KEY ("post_id", "author_id");
