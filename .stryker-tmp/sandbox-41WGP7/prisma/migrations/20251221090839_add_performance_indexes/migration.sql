-- CreateIndex
CREATE INDEX "Attempt_examId_estado_idx" ON "Attempt"("examId", "estado");

-- CreateIndex
CREATE INDEX "Attempt_estado_createdAt_idx" ON "Attempt"("estado", "createdAt");

-- CreateIndex
CREATE INDEX "AttemptAnswer_attemptId_esCorrecta_idx" ON "AttemptAnswer"("attemptId", "esCorrecta");

-- CreateIndex
CREATE INDEX "AttemptAnswer_questionId_esCorrecta_idx" ON "AttemptAnswer"("questionId", "esCorrecta");

-- CreateIndex
CREATE INDEX "Exam_subjectId_tipo_idx" ON "Exam"("subjectId", "tipo");

-- CreateIndex
CREATE INDEX "Exam_tipo_createdAt_idx" ON "Exam"("tipo", "createdAt");
