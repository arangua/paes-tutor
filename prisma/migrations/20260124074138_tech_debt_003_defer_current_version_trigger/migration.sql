BEGIN;

-- 1) borrar trigger actual (si existe)
DROP TRIGGER IF EXISTS "study_note_current_version_validation" ON "StudyNote";
DROP TRIGGER IF EXISTS "trg_validate_current_version_exists" ON "StudyNote";

-- 2) recrearlo como CONSTRAINT TRIGGER DEFERRABLE (se evalúa al COMMIT)
CREATE CONSTRAINT TRIGGER "trg_validate_current_version_exists"
AFTER INSERT OR UPDATE OF "currentVersion" ON "StudyNote"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION "validate_current_version_exists"();

COMMIT;
