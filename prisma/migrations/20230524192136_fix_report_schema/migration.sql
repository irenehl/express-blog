/*
  Warnings:

  - The primary key for the `Report` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_post_id_fkey";

-- DropIndex
DROP INDEX "Report_comment_id_key";

-- DropIndex
DROP INDEX "Report_id_key";

-- DropIndex
DROP INDEX "Report_post_id_key";

-- AlterTable
ALTER TABLE "Report" DROP CONSTRAINT "Report_pkey",
ALTER COLUMN "post_id" DROP NOT NULL,
ALTER COLUMN "comment_id" DROP NOT NULL,
ADD CONSTRAINT "Report_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
