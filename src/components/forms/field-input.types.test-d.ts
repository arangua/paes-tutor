import { expectTypeOf } from "vitest";
import type { ComponentProps } from "react";
import { FieldInput } from "./FieldInput";

type Props = ComponentProps<typeof FieldInput>;

// Debe existir y ser string
expectTypeOf<Props["name"]>().toEqualTypeOf<string>();
