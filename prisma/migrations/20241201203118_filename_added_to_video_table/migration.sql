/*
  Warnings:

  - Added the required column `fileName` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "noteId" TEXT NOT NULL,
    "videoKey" TEXT NOT NULL,
    "thumbnailKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "duration" REAL NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "codec" TEXT NOT NULL,
    "bitrate" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Video_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("bitrate", "codec", "createdAt", "duration", "height", "id", "noteId", "thumbnailKey", "updatedAt", "videoKey", "width") SELECT "bitrate", "codec", "createdAt", "duration", "height", "id", "noteId", "thumbnailKey", "updatedAt", "videoKey", "width" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
CREATE UNIQUE INDEX "Video_noteId_key" ON "Video"("noteId");
CREATE INDEX "Video_noteId_idx" ON "Video"("noteId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
