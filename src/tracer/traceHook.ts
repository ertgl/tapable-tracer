import type { AnyHook } from "../hook/AnyHook";

import type { HookTracingOptions } from "./HookTracingOptions";
import type { Tracer } from "./Tracer";

export function traceHook(
  tracer: Tracer,
  hook: AnyHook,
  options?: HookTracingOptions | null,
): void
{
  tracer.traceHook(
    hook,
    options,
  );
}
