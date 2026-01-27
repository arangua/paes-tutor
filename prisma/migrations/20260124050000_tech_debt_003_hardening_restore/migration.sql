BEGIN;

-- Ensure function exists
CREATE OR REPLACE FUNCTION public.validate_current_version_exists()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "StudyNoteVersion"
    WHERE "StudyNoteVersion"."studyNoteId" = NEW."id"
      AND "StudyNoteVersion"."version" = NEW."currentVersion"
  ) THEN
    RAISE EXCEPTION
      'currentVersion % does not exist in StudyNoteVersion for note %',
      NEW."currentVersion",
      NEW."id";
  END IF;

  RETURN NEW;
END;
$function$;

-- Drop previous triggers if any
DROP TRIGGER IF EXISTS "study_note_current_version_validation" ON "StudyNote";
DROP TRIGGER IF EXISTS "trg_validate_current_version_exists" ON "StudyNote";

-- Recreate as deferrable constraint trigger
CREATE CONSTRAINT TRIGGER "trg_validate_current_version_exists"
AFTER INSERT OR UPDATE OF "currentVersion" ON "StudyNote"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION public.validate_current_version_exists();

COMMIT;
