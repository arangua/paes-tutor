import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("auto-genera id cuando no se proporciona", () => {
    render(<Textarea data-testid="t" />);
    const el = screen.getByTestId("t");
    expect(el).toHaveAttribute("id");
    expect(el.getAttribute("id")).toBeTruthy();
  });

  it("NO auto-genera name cuando no se proporciona", () => {
    render(<Textarea data-testid="t" />);
    const el = screen.getByTestId("t");
    expect(el).not.toHaveAttribute("name");
  });

  it("usa id y name cuando se proporcionan", () => {
    render(<Textarea data-testid="t" id="notes" name="notes" />);
    const el = screen.getByTestId("t");
    expect(el).toHaveAttribute("id", "notes");
    expect(el).toHaveAttribute("name", "notes");
  });

  it("puede tener id sin name (casos no-form)", () => {
    render(<Textarea data-testid="t" id="only-id" />);
    const el = screen.getByTestId("t");
    expect(el).toHaveAttribute("id", "only-id");
    expect(el).not.toHaveAttribute("name");
  });

  it("no sobreescribe id si se proporciona", () => {
    render(<Textarea data-testid="t" id="fixed" />);
    const el = screen.getByTestId("t");
    expect(el).toHaveAttribute("id", "fixed");
  });

  it("no sobreescribe name si se proporciona", () => {
    render(<Textarea data-testid="t" name="message" />);
    const el = screen.getByTestId("t");
    expect(el).toHaveAttribute("name", "message");
  });

  it("mantiene props estándar (placeholder)", () => {
    render(<Textarea data-testid="t" placeholder="Escribe..." />);
    const el = screen.getByTestId("t");
    expect(el).toHaveAttribute("placeholder", "Escribe...");
  });

  it("forwardea className", () => {
    render(<Textarea data-testid="t" className="custom" />);
    const el = screen.getByTestId("t");
    expect(el).toHaveClass("custom");
  });
});
