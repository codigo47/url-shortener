/*
  Warnings:

  - Added the required column `updatedAt` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "slug" SET DEFAULT substring(uuid_generate_v4()::text, 1, 6);
