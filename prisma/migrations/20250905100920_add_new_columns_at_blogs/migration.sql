/*
  Warnings:

  - You are about to drop the column `content` on the `blogs` table. All the data in the column will be lost.
  - Added the required column `markdown` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "content",
ADD COLUMN     "markdown" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL;
