-- CreateTable
CREATE TABLE "SharedMaterial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "materialId" TEXT NOT NULL,
    "sharedById" TEXT NOT NULL,
    "sharedWithId" TEXT NOT NULL,
    "message" TEXT,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "viewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SharedMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "StudyMaterial" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SharedMaterial_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SharedMaterial_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SharedMaterial_sharedWithId_viewed_idx" ON "SharedMaterial"("sharedWithId", "viewed");

-- CreateIndex
CREATE INDEX "SharedMaterial_sharedById_createdAt_idx" ON "SharedMaterial"("sharedById", "createdAt");

-- CreateIndex
CREATE INDEX "SharedMaterial_sharedWithId_createdAt_idx" ON "SharedMaterial"("sharedWithId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SharedMaterial_materialId_sharedById_sharedWithId_key" ON "SharedMaterial"("materialId", "sharedById", "sharedWithId");
