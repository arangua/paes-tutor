import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

// Import desde el archivo select.tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select";

describe("SelectTrigger", () => {
  it("renderiza un trigger accesible (role=combobox o button)", () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Selecciona..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );

    // Normalmente Radix expone role="combobox". Si tu implementación usa button, igual lo cubrimos.
    const byRole =
      screen.queryByRole("combobox") ??
      screen.queryByRole("button");

    expect(byRole).toBeTruthy();
  });

  it("NO tiene atributo name por defecto (no es input)", () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Selecciona..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId("trigger");
    // el data-testid puede estar en el trigger wrapper, pero el atributo name relevante
    // debe NO existir en el elemento que sea el control interactivo real.
    const btn = trigger.querySelector("button") ?? trigger;
    expect(btn).not.toHaveAttribute("name");
  });

  it("si alguien intenta pasar name, NO debe aparecer en el DOM", () => {
    // @ts-expect-error - enterprise: SelectTrigger no acepta 'name'
    render(
      <Select>
        <SelectTrigger data-testid="trigger" name="should-not-exist">
          <SelectValue placeholder="Selecciona..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId("trigger");
    const btn = trigger.querySelector("button") ?? trigger;
    expect(btn).not.toHaveAttribute("name");
  });

  it("puede tener id (si se entrega) y NO implica name", () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger" id="my-select">
          <SelectValue placeholder="Selecciona..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId("trigger");
    const btn = trigger.querySelector("button") ?? trigger;
    expect(trigger).toHaveAttribute("id", "my-select");
    expect(btn).not.toHaveAttribute("name");
  });
});
