/*
  Warnings:

  - You are about to drop the `Home` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Home" DROP CONSTRAINT "Home_ownerId_fkey";

-- DropTable
DROP TABLE "Home";
