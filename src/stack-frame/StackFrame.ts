import type { CallFrame } from "./CallFrame";
import type { TapFrame } from "./TapFrame";
import type { TriggerFrame } from "./TriggerFrame";

export type StackFrame = (
  | CallFrame
  | TapFrame
  | TriggerFrame
);
