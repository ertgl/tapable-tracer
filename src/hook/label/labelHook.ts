import type { HookTracingOptions } from "../../tracer/HookTracingOptions";
import type { AnyHook } from "../AnyHook";

import type { HookLabel } from "./HookLabel";

export function labelHook(
  hook: AnyHook,
  sequence: number,
  options: HookTracingOptions,
): HookLabel
{
  if (hook.name)
  {
    return hook.name;
  }

  if (options.key)
  {
    return options.key;
  }

  return `Unknown hook #${String(sequence)}`;
}
