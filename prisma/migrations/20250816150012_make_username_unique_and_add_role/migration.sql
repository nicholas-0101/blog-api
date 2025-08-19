/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."RoleType" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."RoleType" NOT NULL DEFAULT 'user';

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");
