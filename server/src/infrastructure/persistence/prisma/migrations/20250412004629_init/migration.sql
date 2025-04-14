-- AlterTable
ALTER TABLE "Url" ALTER COLUMN "slug" SET DEFAULT substring(uuid_generate_v4()::text, 1, 6);
