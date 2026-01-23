-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'student',
    "openaiApiKey" TEXT,
    "anthropicApiKey" TEXT,
    "geminiApiKey" TEXT,
    "preferredAIService" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "ejeTematico" TEXT NOT NULL,
    "descripcion" TEXT,
    "codigoTemarioOficial" TEXT,
    "habilidadesTemario" TEXT,
    "vigenciaDesde" TEXT,
    "vigenciaHasta" TEXT,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyMaterial" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "topicId" TEXT,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "fuente" TEXT,
    "tipo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudyMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "topicId" TEXT,
    "enunciado" TEXT NOT NULL,
    "dificultad" INTEGER NOT NULL,
    "explicacion" TEXT NOT NULL,
    "fuente" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "letra" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "esCorrecta" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" TEXT NOT NULL,
    "tiempoLimiteMin" INTEGER,
    "totalPreguntas" INTEGER NOT NULL,
    "fuente" TEXT,
    "esSimulacionOficial" BOOLEAN NOT NULL DEFAULT false,
    "fuenteSimulacion" TEXT,
    "fechaSimulacion" TIMESTAMP(3),
    "procesoAdmision" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamQuestion" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "ExamQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreTable" (
    "id" TEXT NOT NULL,
    "subjectCodigo" TEXT NOT NULL,
    "proceso" TEXT NOT NULL,
    "tipoAplicacion" TEXT NOT NULL,
    "forma" TEXT NOT NULL,
    "correctas" INTEGER NOT NULL,
    "puntajePaes" INTEGER NOT NULL,

    CONSTRAINT "ScoreTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "proceso" TEXT,
    "tipoAplicacion" TEXT,
    "forma" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'en_progreso',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "duracionSegundos" INTEGER,
    "totalPreguntas" INTEGER NOT NULL DEFAULT 0,
    "correctas" INTEGER NOT NULL DEFAULT 0,
    "incorrectas" INTEGER NOT NULL DEFAULT 0,
    "omitidas" INTEGER NOT NULL DEFAULT 0,
    "porcentaje" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "puntajePaes" INTEGER,
    "puntajeEstimado" BOOLEAN NOT NULL DEFAULT false,
    "analisisIA" TEXT,
    "fortalezas" TEXT,
    "debilidades" TEXT,
    "recomendaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttemptAnswer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionSelectedId" TEXT,
    "esCorrecta" BOOLEAN,
    "omitida" BOOLEAN NOT NULL DEFAULT false,
    "tiempoSegundos" INTEGER,
    "explicacionIA" TEXT,

    CONSTRAINT "AttemptAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceMetric" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "totalPreguntas" INTEGER NOT NULL DEFAULT 0,
    "correctas" INTEGER NOT NULL DEFAULT 0,
    "porcentaje" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nivel" TEXT,
    "tendencia" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerformanceMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeSession" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "totalPreguntas" INTEGER NOT NULL DEFAULT 0,
    "correctas" INTEGER NOT NULL DEFAULT 0,
    "incorrectas" INTEGER NOT NULL DEFAULT 0,
    "omitidas" INTEGER NOT NULL DEFAULT 0,
    "porcentaje" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "duracionSegundos" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "PracticeSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeAnswer" (
    "id" TEXT NOT NULL,
    "practiceSessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionSelectedId" TEXT,
    "esCorrecta" BOOLEAN,
    "omitida" BOOLEAN NOT NULL DEFAULT false,
    "tiempoSegundos" INTEGER,

    CONSTRAINT "PracticeAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questionId" TEXT,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "difficulty" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "lastReview" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextReview" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyNote" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questionId" TEXT,
    "topicId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyNoteVersion" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT,
    "name" TEXT,
    "color" TEXT,
    "isImportant" BOOLEAN NOT NULL DEFAULT false,
    "isCompressed" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "StudyNoteVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VersionComment" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VersionComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VersionRestoreHistory" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "restoredVersionId" TEXT NOT NULL,
    "restoredBy" TEXT NOT NULL,
    "restoredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VersionRestoreHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySchedule" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 60,
    "type" TEXT NOT NULL,
    "topicId" TEXT,
    "examId" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudySchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedExam" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "sharedById" TEXT NOT NULL,
    "sharedWithId" TEXT NOT NULL,
    "message" TEXT,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "viewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedMaterial" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "sharedById" TEXT NOT NULL,
    "sharedWithId" TEXT NOT NULL,
    "message" TEXT,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "viewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedFlashcard" (
    "id" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "sharedById" TEXT NOT NULL,
    "sharedWithId" TEXT NOT NULL,
    "message" TEXT,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "viewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedFlashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedNote" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "sharedById" TEXT NOT NULL,
    "sharedWithId" TEXT NOT NULL,
    "message" TEXT,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "viewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedNoteVersion" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "sharedById" TEXT NOT NULL,
    "sharedWithId" TEXT NOT NULL,
    "message" TEXT,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "viewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedNoteVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "examId" TEXT,
    "challengerId" TEXT NOT NULL,
    "challengedId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "deadline" TIMESTAMP(3),
    "challengerAttemptId" TEXT,
    "challengedAttemptId" TEXT,
    "winnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdmissionCalendar" (
    "id" TEXT NOT NULL,
    "proceso" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora" TEXT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" TEXT NOT NULL,
    "importante" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdmissionCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Career" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "universidad" TEXT NOT NULL,
    "proceso" TEXT NOT NULL,
    "vacantes" INTEGER,
    "ponderacionNEM" DOUBLE PRECISION NOT NULL,
    "ponderacionRanking" DOUBLE PRECISION NOT NULL,
    "ponderacionLectora" DOUBLE PRECISION NOT NULL,
    "ponderacionM1" DOUBLE PRECISION NOT NULL,
    "ponderacionM2" DOUBLE PRECISION,
    "ponderacionCiencias" DOUBLE PRECISION,
    "ponderacionHistoria" DOUBLE PRECISION,
    "puntajeMinimo" INTEGER,
    "pruebasRequeridas" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficialStatistics" (
    "id" TEXT NOT NULL,
    "prueba" TEXT NOT NULL,
    "proceso" TEXT NOT NULL,
    "tipoAplicacion" TEXT,
    "promedio" DOUBLE PRECISION NOT NULL,
    "desviacionEstandar" DOUBLE PRECISION NOT NULL,
    "percentil50" DOUBLE PRECISION NOT NULL,
    "percentil75" DOUBLE PRECISION NOT NULL,
    "percentil90" DOUBLE PRECISION NOT NULL,
    "percentil95" DOUBLE PRECISION NOT NULL,
    "preguntasFaciles" INTEGER,
    "preguntasMedias" INTEGER,
    "preguntasDificiles" INTEGER,
    "datosAdicionales" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficialStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreTransformation" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "proceso" TEXT,
    "prueba" TEXT,
    "valorOrigen" DOUBLE PRECISION NOT NULL,
    "valorDestino" DOUBLE PRECISION NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScoreTransformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "relatedId" TEXT,
    "relatedType" TEXT,
    "actionUrl" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT,
    "events" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "noteId" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookDelivery" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statusCode" INTEGER,
    "response" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttempt" TIMESTAMP(3),
    "nextRetry" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_codigo_key" ON "Subject"("codigo");

-- CreateIndex
CREATE INDEX "Topic_subjectId_idx" ON "Topic"("subjectId");

-- CreateIndex
CREATE INDEX "Topic_codigoTemarioOficial_idx" ON "Topic"("codigoTemarioOficial");

-- CreateIndex
CREATE INDEX "StudyMaterial_subjectId_topicId_idx" ON "StudyMaterial"("subjectId", "topicId");

-- CreateIndex
CREATE INDEX "Question_subjectId_topicId_idx" ON "Question"("subjectId", "topicId");

-- CreateIndex
CREATE INDEX "Exam_subjectId_tipo_idx" ON "Exam"("subjectId", "tipo");

-- CreateIndex
CREATE INDEX "Exam_tipo_createdAt_idx" ON "Exam"("tipo", "createdAt");

-- CreateIndex
CREATE INDEX "Exam_esSimulacionOficial_idx" ON "Exam"("esSimulacionOficial");

-- CreateIndex
CREATE INDEX "Exam_procesoAdmision_idx" ON "Exam"("procesoAdmision");

-- CreateIndex
CREATE UNIQUE INDEX "ExamQuestion_examId_questionId_key" ON "ExamQuestion"("examId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamQuestion_examId_orden_key" ON "ExamQuestion"("examId", "orden");

-- CreateIndex
CREATE INDEX "ScoreTable_subjectCodigo_proceso_tipoAplicacion_forma_idx" ON "ScoreTable"("subjectCodigo", "proceso", "tipoAplicacion", "forma");

-- CreateIndex
CREATE UNIQUE INDEX "ScoreTable_subjectCodigo_proceso_tipoAplicacion_forma_corre_key" ON "ScoreTable"("subjectCodigo", "proceso", "tipoAplicacion", "forma", "correctas");

-- CreateIndex
CREATE INDEX "Attempt_studentId_createdAt_idx" ON "Attempt"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "Attempt_studentId_estado_idx" ON "Attempt"("studentId", "estado");

-- CreateIndex
CREATE INDEX "Attempt_studentId_examId_estado_idx" ON "Attempt"("studentId", "examId", "estado");

-- CreateIndex
CREATE INDEX "Attempt_examId_estado_idx" ON "Attempt"("examId", "estado");

-- CreateIndex
CREATE INDEX "Attempt_estado_createdAt_idx" ON "Attempt"("estado", "createdAt");

-- CreateIndex
CREATE INDEX "AttemptAnswer_attemptId_esCorrecta_idx" ON "AttemptAnswer"("attemptId", "esCorrecta");

-- CreateIndex
CREATE INDEX "AttemptAnswer_questionId_esCorrecta_idx" ON "AttemptAnswer"("questionId", "esCorrecta");

-- CreateIndex
CREATE UNIQUE INDEX "AttemptAnswer_attemptId_questionId_key" ON "AttemptAnswer"("attemptId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceMetric_studentId_topicId_key" ON "PerformanceMetric"("studentId", "topicId");

-- CreateIndex
CREATE INDEX "PracticeSession_studentId_topicId_idx" ON "PracticeSession"("studentId", "topicId");

-- CreateIndex
CREATE INDEX "PracticeSession_studentId_startedAt_idx" ON "PracticeSession"("studentId", "startedAt");

-- CreateIndex
CREATE INDEX "PracticeAnswer_practiceSessionId_esCorrecta_idx" ON "PracticeAnswer"("practiceSessionId", "esCorrecta");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeAnswer_practiceSessionId_questionId_key" ON "PracticeAnswer"("practiceSessionId", "questionId");

-- CreateIndex
CREATE INDEX "Bookmark_studentId_createdAt_idx" ON "Bookmark"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "Bookmark_questionId_idx" ON "Bookmark"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_studentId_questionId_key" ON "Bookmark"("studentId", "questionId");

-- CreateIndex
CREATE INDEX "Flashcard_studentId_nextReview_idx" ON "Flashcard"("studentId", "nextReview");

-- CreateIndex
CREATE INDEX "Flashcard_studentId_createdAt_idx" ON "Flashcard"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "StudyNote_studentId_createdAt_idx" ON "StudyNote"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "StudyNote_studentId_topicId_idx" ON "StudyNote"("studentId", "topicId");

-- CreateIndex
CREATE INDEX "StudyNote_questionId_idx" ON "StudyNote"("questionId");

-- CreateIndex
CREATE INDEX "StudyNoteVersion_noteId_createdAt_idx" ON "StudyNoteVersion"("noteId", "createdAt");

-- CreateIndex
CREATE INDEX "StudyNoteVersion_noteId_isImportant_createdAt_idx" ON "StudyNoteVersion"("noteId", "isImportant", "createdAt");

-- CreateIndex
CREATE INDEX "StudyNoteVersion_noteId_createdAt_isImportant_idx" ON "StudyNoteVersion"("noteId", "createdAt", "isImportant");

-- CreateIndex
CREATE INDEX "StudyNoteVersion_noteId_createdBy_idx" ON "StudyNoteVersion"("noteId", "createdBy");

-- CreateIndex
CREATE INDEX "StudyNoteVersion_noteId_idx" ON "StudyNoteVersion"("noteId");

-- CreateIndex
CREATE INDEX "StudyNoteVersion_createdBy_idx" ON "StudyNoteVersion"("createdBy");

-- CreateIndex
CREATE INDEX "StudyNoteVersion_isImportant_idx" ON "StudyNoteVersion"("isImportant");

-- CreateIndex
CREATE INDEX "StudyNoteVersion_isCompressed_idx" ON "StudyNoteVersion"("isCompressed");

-- CreateIndex
CREATE INDEX "VersionComment_versionId_createdAt_idx" ON "VersionComment"("versionId", "createdAt");

-- CreateIndex
CREATE INDEX "VersionComment_noteId_versionId_createdAt_idx" ON "VersionComment"("noteId", "versionId", "createdAt");

-- CreateIndex
CREATE INDEX "VersionComment_noteId_idx" ON "VersionComment"("noteId");

-- CreateIndex
CREATE INDEX "VersionComment_createdBy_idx" ON "VersionComment"("createdBy");

-- CreateIndex
CREATE INDEX "VersionRestoreHistory_noteId_restoredAt_idx" ON "VersionRestoreHistory"("noteId", "restoredAt");

-- CreateIndex
CREATE INDEX "VersionRestoreHistory_restoredBy_restoredAt_idx" ON "VersionRestoreHistory"("restoredBy", "restoredAt");

-- CreateIndex
CREATE INDEX "VersionRestoreHistory_restoredBy_idx" ON "VersionRestoreHistory"("restoredBy");

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

-- CreateIndex
CREATE INDEX "SharedMaterial_sharedWithId_viewed_idx" ON "SharedMaterial"("sharedWithId", "viewed");

-- CreateIndex
CREATE INDEX "SharedMaterial_sharedById_createdAt_idx" ON "SharedMaterial"("sharedById", "createdAt");

-- CreateIndex
CREATE INDEX "SharedMaterial_sharedWithId_createdAt_idx" ON "SharedMaterial"("sharedWithId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SharedMaterial_materialId_sharedById_sharedWithId_key" ON "SharedMaterial"("materialId", "sharedById", "sharedWithId");

-- CreateIndex
CREATE INDEX "SharedFlashcard_sharedWithId_viewed_idx" ON "SharedFlashcard"("sharedWithId", "viewed");

-- CreateIndex
CREATE INDEX "SharedFlashcard_sharedById_createdAt_idx" ON "SharedFlashcard"("sharedById", "createdAt");

-- CreateIndex
CREATE INDEX "SharedFlashcard_sharedWithId_createdAt_idx" ON "SharedFlashcard"("sharedWithId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SharedFlashcard_flashcardId_sharedById_sharedWithId_key" ON "SharedFlashcard"("flashcardId", "sharedById", "sharedWithId");

-- CreateIndex
CREATE INDEX "SharedNote_sharedWithId_viewed_idx" ON "SharedNote"("sharedWithId", "viewed");

-- CreateIndex
CREATE INDEX "SharedNote_sharedById_createdAt_idx" ON "SharedNote"("sharedById", "createdAt");

-- CreateIndex
CREATE INDEX "SharedNote_sharedWithId_createdAt_idx" ON "SharedNote"("sharedWithId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SharedNote_noteId_sharedById_sharedWithId_key" ON "SharedNote"("noteId", "sharedById", "sharedWithId");

-- CreateIndex
CREATE INDEX "SharedNoteVersion_sharedWithId_viewed_idx" ON "SharedNoteVersion"("sharedWithId", "viewed");

-- CreateIndex
CREATE INDEX "SharedNoteVersion_sharedById_createdAt_idx" ON "SharedNoteVersion"("sharedById", "createdAt");

-- CreateIndex
CREATE INDEX "SharedNoteVersion_sharedWithId_createdAt_idx" ON "SharedNoteVersion"("sharedWithId", "createdAt");

-- CreateIndex
CREATE INDEX "SharedNoteVersion_versionId_idx" ON "SharedNoteVersion"("versionId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedNoteVersion_noteId_versionId_sharedById_sharedWithId_key" ON "SharedNoteVersion"("noteId", "versionId", "sharedById", "sharedWithId");

-- CreateIndex
CREATE INDEX "Challenge_challengerId_status_idx" ON "Challenge"("challengerId", "status");

-- CreateIndex
CREATE INDEX "Challenge_challengedId_status_idx" ON "Challenge"("challengedId", "status");

-- CreateIndex
CREATE INDEX "Challenge_status_createdAt_idx" ON "Challenge"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Challenge_examId_status_idx" ON "Challenge"("examId", "status");

-- CreateIndex
CREATE INDEX "AdmissionCalendar_proceso_fecha_idx" ON "AdmissionCalendar"("proceso", "fecha");

-- CreateIndex
CREATE INDEX "AdmissionCalendar_tipo_fecha_idx" ON "AdmissionCalendar"("tipo", "fecha");

-- CreateIndex
CREATE INDEX "AdmissionCalendar_importante_fecha_idx" ON "AdmissionCalendar"("importante", "fecha");

-- CreateIndex
CREATE INDEX "Career_proceso_universidad_idx" ON "Career"("proceso", "universidad");

-- CreateIndex
CREATE INDEX "Career_nombre_idx" ON "Career"("nombre");

-- CreateIndex
CREATE INDEX "Career_activa_idx" ON "Career"("activa");

-- CreateIndex
CREATE INDEX "OfficialStatistics_prueba_proceso_idx" ON "OfficialStatistics"("prueba", "proceso");

-- CreateIndex
CREATE UNIQUE INDEX "OfficialStatistics_prueba_proceso_tipoAplicacion_key" ON "OfficialStatistics"("prueba", "proceso", "tipoAplicacion");

-- CreateIndex
CREATE INDEX "ScoreTransformation_tipo_proceso_prueba_idx" ON "ScoreTransformation"("tipo", "proceso", "prueba");

-- CreateIndex
CREATE INDEX "ScoreTransformation_tipo_valorOrigen_idx" ON "ScoreTransformation"("tipo", "valorOrigen");

-- CreateIndex
CREATE INDEX "ScoreTransformation_activa_idx" ON "ScoreTransformation"("activa");

-- CreateIndex
CREATE INDEX "Notification_studentId_read_idx" ON "Notification"("studentId", "read");

-- CreateIndex
CREATE INDEX "Notification_studentId_createdAt_idx" ON "Notification"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_studentId_type_idx" ON "Notification"("studentId", "type");

-- CreateIndex
CREATE INDEX "Notification_read_createdAt_idx" ON "Notification"("read", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_expiresAt_idx" ON "Notification"("expiresAt");

-- CreateIndex
CREATE INDEX "Webhook_studentId_active_idx" ON "Webhook"("studentId", "active");

-- CreateIndex
CREATE INDEX "Webhook_noteId_idx" ON "Webhook"("noteId");

-- CreateIndex
CREATE INDEX "Webhook_active_idx" ON "Webhook"("active");

-- CreateIndex
CREATE INDEX "WebhookDelivery_webhookId_status_idx" ON "WebhookDelivery"("webhookId", "status");

-- CreateIndex
CREATE INDEX "WebhookDelivery_status_nextRetry_idx" ON "WebhookDelivery"("status", "nextRetry");

-- CreateIndex
CREATE INDEX "WebhookDelivery_createdAt_idx" ON "WebhookDelivery"("createdAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyMaterial" ADD CONSTRAINT "StudyMaterial_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyMaterial" ADD CONSTRAINT "StudyMaterial_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamQuestion" ADD CONSTRAINT "ExamQuestion_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamQuestion" ADD CONSTRAINT "ExamQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptAnswer" ADD CONSTRAINT "AttemptAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "Attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptAnswer" ADD CONSTRAINT "AttemptAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptAnswer" ADD CONSTRAINT "AttemptAnswer_optionSelectedId_fkey" FOREIGN KEY ("optionSelectedId") REFERENCES "QuestionOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceMetric" ADD CONSTRAINT "PerformanceMetric_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceMetric" ADD CONSTRAINT "PerformanceMetric_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeAnswer" ADD CONSTRAINT "PracticeAnswer_practiceSessionId_fkey" FOREIGN KEY ("practiceSessionId") REFERENCES "PracticeSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeAnswer" ADD CONSTRAINT "PracticeAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeAnswer" ADD CONSTRAINT "PracticeAnswer_optionSelectedId_fkey" FOREIGN KEY ("optionSelectedId") REFERENCES "QuestionOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyNote" ADD CONSTRAINT "StudyNote_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyNote" ADD CONSTRAINT "StudyNote_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyNote" ADD CONSTRAINT "StudyNote_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyNoteVersion" ADD CONSTRAINT "StudyNoteVersion_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "StudyNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VersionComment" ADD CONSTRAINT "VersionComment_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "StudyNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VersionRestoreHistory" ADD CONSTRAINT "VersionRestoreHistory_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "StudyNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySchedule" ADD CONSTRAINT "StudySchedule_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySchedule" ADD CONSTRAINT "StudySchedule_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySchedule" ADD CONSTRAINT "StudySchedule_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedExam" ADD CONSTRAINT "SharedExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedExam" ADD CONSTRAINT "SharedExam_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedExam" ADD CONSTRAINT "SharedExam_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedMaterial" ADD CONSTRAINT "SharedMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "StudyMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedMaterial" ADD CONSTRAINT "SharedMaterial_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedMaterial" ADD CONSTRAINT "SharedMaterial_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedFlashcard" ADD CONSTRAINT "SharedFlashcard_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedFlashcard" ADD CONSTRAINT "SharedFlashcard_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedFlashcard" ADD CONSTRAINT "SharedFlashcard_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedNote" ADD CONSTRAINT "SharedNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "StudyNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedNote" ADD CONSTRAINT "SharedNote_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedNote" ADD CONSTRAINT "SharedNote_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedNoteVersion" ADD CONSTRAINT "SharedNoteVersion_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "StudyNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedNoteVersion" ADD CONSTRAINT "SharedNoteVersion_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedNoteVersion" ADD CONSTRAINT "SharedNoteVersion_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_challengerId_fkey" FOREIGN KEY ("challengerId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_challengedId_fkey" FOREIGN KEY ("challengedId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_challengerAttemptId_fkey" FOREIGN KEY ("challengerAttemptId") REFERENCES "Attempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_challengedAttemptId_fkey" FOREIGN KEY ("challengedAttemptId") REFERENCES "Attempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookDelivery" ADD CONSTRAINT "WebhookDelivery_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
