import type { HookTracingOptions } from "../../tracer/HookTracingOptions";
import type { AnyHook } from "../AnyHook";

import type { HookLabel } from "./HookLabel";

export type HookLabellerFunction = (
  hook: AnyHook,
  sequence: number,
  options: HookTracingOptions,
) => HookLabel;
