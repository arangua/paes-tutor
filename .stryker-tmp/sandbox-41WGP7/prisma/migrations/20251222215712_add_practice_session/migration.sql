-- CreateTable
CREATE TABLE "PracticeSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "totalPreguntas" INTEGER NOT NULL DEFAULT 0,
    "correctas" INTEGER NOT NULL DEFAULT 0,
    "incorrectas" INTEGER NOT NULL DEFAULT 0,
    "omitidas" INTEGER NOT NULL DEFAULT 0,
    "porcentaje" REAL NOT NULL DEFAULT 0,
    "duracionSegundos" INTEGER,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    CONSTRAINT "PracticeSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PracticeSession_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PracticeAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "practiceSessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionSelectedId" TEXT,
    "esCorrecta" BOOLEAN,
    "omitida" BOOLEAN NOT NULL DEFAULT false,
    "tiempoSegundos" INTEGER,
    CONSTRAINT "PracticeAnswer_practiceSessionId_fkey" FOREIGN KEY ("practiceSessionId") REFERENCES "PracticeSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PracticeAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PracticeAnswer_optionSelectedId_fkey" FOREIGN KEY ("optionSelectedId") REFERENCES "QuestionOption" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PracticeSession_studentId_topicId_idx" ON "PracticeSession"("studentId", "topicId");

-- CreateIndex
CREATE INDEX "PracticeSession_studentId_startedAt_idx" ON "PracticeSession"("studentId", "startedAt");

-- CreateIndex
CREATE INDEX "PracticeAnswer_practiceSessionId_esCorrecta_idx" ON "PracticeAnswer"("practiceSessionId", "esCorrecta");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeAnswer_practiceSessionId_questionId_key" ON "PracticeAnswer"("practiceSessionId", "questionId");
