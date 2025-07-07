import type { FullTap } from "tapable";

import type { AnyHook } from "../../../hook/AnyHook";
import type { StackFrame } from "../../../stack-frame/StackFrame";
import type { HookTracingOptions } from "../../options/HookTracingOptions";

export type HandleStackFrameHookPayload = {
  frame: StackFrame;
  hook: AnyHook;
  options: HookTracingOptions;
  tap: FullTap | null;
};
