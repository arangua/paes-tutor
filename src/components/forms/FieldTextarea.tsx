"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";

type FieldTextareaProps = React.ComponentProps<typeof Textarea> & {
  name: string; // ✅ obligatorio
};

export function FieldTextarea({ name, id, ...props }: FieldTextareaProps) {
  // ✅ runtime guard solo en dev (evita bugs silenciosos)
  if (process.env.NODE_ENV !== "production" && !name) {
    throw new Error('[FieldTextarea] Missing required prop "name".');
  }

  // id: si no viene, lo genera Textarea (ya lo dejaste así)
  return <Textarea id={id} name={name} {...props} />;
}
