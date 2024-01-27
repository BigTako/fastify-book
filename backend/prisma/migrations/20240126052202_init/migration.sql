/*
  Warnings:

  - You are about to drop the column `accountActivationToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `accountActivationTokenExpiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `activated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetTokenExpires` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_authorId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accountActivationToken",
DROP COLUMN "accountActivationTokenExpiresAt",
DROP COLUMN "activated",
DROP COLUMN "passwordResetToken",
DROP COLUMN "passwordResetTokenExpires";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Like";
