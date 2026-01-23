import { expectTypeOf } from "vitest";
import type { ComponentProps } from "react";
import { FieldTextarea } from "./FieldTextarea";

type Props = ComponentProps<typeof FieldTextarea>;

expectTypeOf<Props["name"]>().toEqualTypeOf<string>();
