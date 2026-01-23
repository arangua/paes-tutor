-- CreateIndex
CREATE INDEX "Attempt_studentId_estado_idx" ON "Attempt"("studentId", "estado");

-- CreateIndex
CREATE INDEX "Attempt_studentId_examId_estado_idx" ON "Attempt"("studentId", "examId", "estado");
