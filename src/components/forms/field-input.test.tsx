import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { FieldInput } from "./FieldInput";

describe("FieldInput", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    // Silenciar error logs del render que falla
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
      render(<FieldInput />);
    }).toThrow(/name/i);
  });

  it("con name: renderiza sin lanzar", () => {
    expect(() => {
      render(<FieldInput name="email" />);
    }).not.toThrow();
  });
});
