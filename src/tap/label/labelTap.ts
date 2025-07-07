import type { FullTap } from "tapable";

import type { AnyHook } from "../../hook/AnyHook";
import type { HookTracingOptions } from "../../tracer/options/HookTracingOptions";

import type { TapLabel } from "./TapLabel";

export function labelTap(
  hook: AnyHook,
  tap: FullTap,
  sequence: number,
  options: HookTracingOptions,
): TapLabel
{
  if (tap.name)
  {
    return tap.name;
  }

  return `Unknown tap #${String(sequence)}`;
}
