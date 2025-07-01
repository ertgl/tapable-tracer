import type { CallFrame } from "../CallFrame";

import type { EncodableCallFrame } from "./EncodableCallFrame";

export function toEncodableCallFrame(
  frame: CallFrame,
): EncodableCallFrame
{
  return {
    callee: frame.callee,
    caller: frame.caller,
    type: frame.type,
  };
}
