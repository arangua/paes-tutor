import { describe, it, expect, vi } from "vitest";
import { dismissImportProgressToast, IMPORT_PROGRESS_TOAST_ID } from "./page";

describe("import-exams page (coverage-only)", () => {
  it("debe ejecutar toast.dismiss con el id de progreso", () => {
    const toastMock = { dismiss: vi.fn() };

    dismissImportProgressToast(toastMock);

    expect(toastMock.dismiss).toHaveBeenCalledTimes(1);
    expect(toastMock.dismiss).toHaveBeenCalledWith(IMPORT_PROGRESS_TOAST_ID);
  });
});
