import type { FullTap } from "tapable";

import type { AnyHook } from "../../hook/AnyHook";
import type { HookTracingOptions } from "../../tracer/options/HookTracingOptions";

import type { TapLabel } from "./TapLabel";

export type TapLabellerFunction = (
  hook: AnyHook,
  tap: FullTap,
  sequence: number,
  options: HookTracingOptions,
) => TapLabel;
