-- CreateTable
CREATE TABLE "StudySchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledAt" DATETIME NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 60,
    "type" TEXT NOT NULL,
    "topicId" TEXT,
    "examId" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudySchedule_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudySchedule_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudySchedule_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SharedExam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "examId" TEXT NOT NULL,
    "sharedById" TEXT NOT NULL,
    "sharedWithId" TEXT NOT NULL,
    "message" TEXT,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "viewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SharedExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SharedExam_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SharedExam_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "StudySchedule_studentId_scheduledAt_idx" ON "StudySchedule"("studentId", "scheduledAt");

-- CreateIndex
CREATE INDEX "StudySchedule_studentId_completed_idx" ON "StudySchedule"("studentId", "completed");

-- CreateIndex
CREATE INDEX "StudySchedule_scheduledAt_idx" ON "StudySchedule"("scheduledAt");

-- CreateIndex
CREATE INDEX "SharedExam_sharedWithId_viewed_idx" ON "SharedExam"("sharedWithId", "viewed");

-- CreateIndex
CREATE INDEX "SharedExam_sharedById_createdAt_idx" ON "SharedExam"("sharedById", "createdAt");

-- CreateIndex
CREATE INDEX "SharedExam_sharedWithId_createdAt_idx" ON "SharedExam"("sharedWithId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SharedExam_examId_sharedById_sharedWithId_key" ON "SharedExam"("examId", "sharedById", "sharedWithId");
