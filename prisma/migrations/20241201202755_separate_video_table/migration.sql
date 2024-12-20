/*
  Warnings:

  - You are about to drop the column `thumbnailKey` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `videoKey` on the `Note` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "noteId" TEXT NOT NULL,
    "videoKey" TEXT NOT NULL,
    "thumbnailKey" TEXT NOT NULL,
    "duration" REAL NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "codec" TEXT NOT NULL,
    "bitrate" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Video_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Note_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("content", "createdAt", "id", "ownerId", "title", "updatedAt") SELECT "content", "createdAt", "id", "ownerId", "title", "updatedAt" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Video_noteId_key" ON "Video"("noteId");

-- CreateIndex
CREATE INDEX "Video_noteId_idx" ON "Video"("noteId");
