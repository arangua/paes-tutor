-- CreateEnum
CREATE TYPE "StudyNoteChangeType" AS ENUM ('CREATE', 'UPDATE', 'PUBLISH', 'UNPUBLISH', 'ARCHIVE', 'RESTORE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "StudyNoteChangeSource" AS ENUM ('UI', 'API', 'MIGRATION', 'IMPORT', 'SYSTEM');

-- DropForeignKey
ALTER TABLE "StudyNoteVersion" DROP CONSTRAINT "StudyNoteVersion_noteId_fkey";

-- DropIndex
DROP INDEX "StudyNoteVersion_createdBy_idx";

-- DropIndex
DROP INDEX "StudyNoteVersion_isCompressed_idx";

-- DropIndex
DROP INDEX "StudyNoteVersion_isImportant_idx";

-- DropIndex
DROP INDEX "StudyNoteVersion_noteId_createdAt_idx";

-- DropIndex
DROP INDEX "StudyNoteVersion_noteId_createdAt_isImportant_idx";

-- DropIndex
DROP INDEX "StudyNoteVersion_noteId_createdBy_idx";

-- DropIndex
DROP INDEX "StudyNoteVersion_noteId_idx";

-- DropIndex
DROP INDEX "StudyNoteVersion_noteId_isImportant_createdAt_idx";

-- AlterTable
ALTER TABLE "StudyNote" ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "currentVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "updatedByUserId" TEXT;

-- AlterTable
ALTER TABLE "StudyNoteVersion" DROP COLUMN "color",
DROP COLUMN "comment",
DROP COLUMN "content",
DROP COLUMN "createdBy",
DROP COLUMN "isCompressed",
DROP COLUMN "isImportant",
DROP COLUMN "name",
DROP COLUMN "noteId",
DROP COLUMN "tags",
DROP COLUMN "title",
ADD COLUMN     "changeSummary" TEXT,
ADD COLUMN     "changeType" "StudyNoteChangeType" NOT NULL,
ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "snapshot" JSONB NOT NULL,
ADD COLUMN     "snapshotHash" TEXT,
ADD COLUMN     "source" "StudyNoteChangeSource" NOT NULL DEFAULT 'API',
ADD COLUMN     "studyNoteId" TEXT NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "StudyNoteVersion_studyNoteId_createdAt_idx" ON "StudyNoteVersion"("studyNoteId", "createdAt");

-- CreateIndex
CREATE INDEX "StudyNoteVersion_createdByUserId_createdAt_idx" ON "StudyNoteVersion"("createdByUserId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StudyNoteVersion_studyNoteId_version_key" ON "StudyNoteVersion"("studyNoteId", "version");

-- AddForeignKey
ALTER TABLE "StudyNoteVersion" ADD CONSTRAINT "StudyNoteVersion_studyNoteId_fkey" FOREIGN KEY ("studyNoteId") REFERENCES "StudyNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
