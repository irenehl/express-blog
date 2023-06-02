-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_author_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_post_id_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_author_id_fkey";

-- DropForeignKey
ALTER TABLE "ReactionsOnComments" DROP CONSTRAINT "ReactionsOnComments_author_id_fkey";

-- DropForeignKey
ALTER TABLE "ReactionsOnComments" DROP CONSTRAINT "ReactionsOnComments_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "ReactionsOnPosts" DROP CONSTRAINT "ReactionsOnPosts_author_id_fkey";

-- DropForeignKey
ALTER TABLE "ReactionsOnPosts" DROP CONSTRAINT "ReactionsOnPosts_post_id_fkey";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionsOnComments" ADD CONSTRAINT "ReactionsOnComments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionsOnComments" ADD CONSTRAINT "ReactionsOnComments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionsOnPosts" ADD CONSTRAINT "ReactionsOnPosts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionsOnPosts" ADD CONSTRAINT "ReactionsOnPosts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
