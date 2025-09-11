/*
  Warnings:

  - You are about to drop the column `markdown` on the `blogs` table. All the data in the column will be lost.
  - Added the required column `content` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `gallery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "markdown",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "gallery" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "image_url" TEXT NOT NULL;
