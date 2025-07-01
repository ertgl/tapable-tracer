import type { FullTap } from "tapable";

import type { AnyHook } from "../../../hook";
import type { StackFrame } from "../../../stack-frame/StackFrame";
import type { HookTracingOptions } from "../../HookTracingOptions";

export type StackFrameHandler = (
  hook: AnyHook,
  tap: FullTap | null,
  frame: StackFrame,
  options: HookTracingOptions,
) => void;
