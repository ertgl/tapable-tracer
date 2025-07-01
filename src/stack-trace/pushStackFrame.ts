import type { StackFrame } from "../stack-frame/StackFrame";

import type { StackTrace } from "./StackTrace";

export function pushStackFrame(
  trace: StackTrace,
  frame: StackFrame,
): void
{
  trace.frames.push(frame);
}
