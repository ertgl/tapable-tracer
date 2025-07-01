import type { CallFrame } from "./CallFrame";
import { STACK_FRAME_TYPE_CALL } from "./type/STACK_FRAME_TYPE_CALL";

export function createCallFrame(
  frame: Omit<CallFrame, "type">,
): CallFrame
{
  return {
    ...frame,
    type: STACK_FRAME_TYPE_CALL,
  };
}
