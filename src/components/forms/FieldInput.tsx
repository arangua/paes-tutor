"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

type FieldInputProps = React.ComponentProps<typeof Input> & {
  name: string; // ✅ obligatorio
};

export function FieldInput({ name, id, ...props }: FieldInputProps) {
  // ✅ runtime guard solo en dev (evita bugs silenciosos)
  if (process.env.NODE_ENV !== "production" && !name) {
    throw new Error('[FieldInput] Missing required prop "name".');
  }

  // id: si no viene, lo genera Input (ya lo dejaste así)
  return <Input id={id} name={name} {...props} />;
}
