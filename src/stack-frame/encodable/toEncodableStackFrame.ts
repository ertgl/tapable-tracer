import type { StackFrame } from "../StackFrame";
import { STACK_FRAME_TYPE_TAP } from "../type/STACK_FRAME_TYPE_TAP";
import { STACK_FRAME_TYPE_TRIGGER } from "../type/STACK_FRAME_TYPE_TRIGGER";

import type { EncodableStackFrame } from "./EncodableStackFrame";
import { toEncodableCallFrame } from "./toEncodableCallFrame";
import { toEncodableTapFrame } from "./toEncodableTapFrame";
import { toEncodableTriggerFrame } from "./toEncodableTriggerFrame";

export function toEncodableStackFrame(
  frame: StackFrame,
): EncodableStackFrame
{
  if (frame.type === STACK_FRAME_TYPE_TAP)
  {
    return toEncodableTapFrame(frame);
  }

  if (frame.type === STACK_FRAME_TYPE_TRIGGER)
  {
    return toEncodableTriggerFrame(frame);
  }

  return toEncodableCallFrame(frame);
}
