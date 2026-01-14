import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { FieldTextarea } from "./FieldTextarea";

describe("FieldTextarea", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    process.env.NODE_ENV = "development";
  });

  afterEach(() => {
    (console.error as any).mockRestore?.();
    process.env.NODE_ENV = originalEnv;
  });

  it("en development: si falta name, lanza error (runtime guard)", () => {
    expect(() => {
      // @ts-expect-error - contract: name es obligatorio
      render(<FieldTextarea />);
    }).toThrow(/name/i);
  });

  it("con name: renderiza sin lanzar", () => {
    expect(() => {
      render(<FieldTextarea name="message" />);
    }).not.toThrow();
  });
});
