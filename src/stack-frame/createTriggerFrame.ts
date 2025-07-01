import type { TriggerFrame } from "./TriggerFrame";
import { STACK_FRAME_TYPE_TRIGGER } from "./type/STACK_FRAME_TYPE_TRIGGER";

export function createTriggerFrame(
  frame: Omit<TriggerFrame, "type">,
): TriggerFrame
{
  return {
    ...frame,
    type: STACK_FRAME_TYPE_TRIGGER,
  };
}
