/*
  Warnings:

  - A unique constraint covering the columns `[sid]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_sid_key" ON "Chat"("sid");
