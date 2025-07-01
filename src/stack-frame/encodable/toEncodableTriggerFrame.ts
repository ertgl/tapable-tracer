import type { TriggerFrame } from "../TriggerFrame";

import type { EncodableTriggerFrame } from "./EncodableTriggerFrame";

export function toEncodableTriggerFrame(
  frame: TriggerFrame,
): EncodableTriggerFrame
{
  return {
    callee: frame.callee,
    caller: frame.caller,
    type: frame.type,
  };
}
