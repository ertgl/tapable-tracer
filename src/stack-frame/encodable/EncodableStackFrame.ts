import type { EncodableCallFrame } from "./EncodableCallFrame";
import type { EncodableTapFrame } from "./EncodableTapFrame";
import type { EncodableTriggerFrame } from "./EncodableTriggerFrame";

export type EncodableStackFrame = (
  | EncodableCallFrame
  | EncodableTapFrame
  | EncodableTriggerFrame
);
