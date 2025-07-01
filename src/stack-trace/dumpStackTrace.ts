import type { EncodableStackFrame } from "../stack-frame/encodable/EncodableStackFrame";
import { toEncodableStackFrame } from "../stack-frame/encodable/toEncodableStackFrame";

import type { StackTrace } from "./StackTrace";

export function dumpStackTrace(
  trace: StackTrace,
): EncodableStackFrame[]
{
  return trace.frames.map(toEncodableStackFrame);
}
