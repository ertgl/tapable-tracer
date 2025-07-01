import type { TapFrame } from "./TapFrame";
import { STACK_FRAME_TYPE_TAP } from "./type/STACK_FRAME_TYPE_TAP";

export function createTapFrame(
  frame: Omit<TapFrame, "type">,
): TapFrame
{
  return {
    ...frame,
    type: STACK_FRAME_TYPE_TAP,
  };
}
