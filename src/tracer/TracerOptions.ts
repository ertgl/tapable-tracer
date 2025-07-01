import type { HookLabellerFunction } from "../hook/label/HookLabellerFunction";
import type { TapLabellerFunction } from "../tap/label/TapLabellerFunction";

import type { StackFrameHandler } from "./callbacks/stack-frame-handler/StackFrameHandler";

export type TracerOptions = {
  handleStackFrame?: null | StackFrameHandler;
  interceptorName?: null | string;
  labelHook?: HookLabellerFunction | null;
  labelTap?: null | TapLabellerFunction;
};
