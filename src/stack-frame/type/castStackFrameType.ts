import type { StackFrameType } from "./StackFrameType";
import type { StackFrameTypeString } from "./StackFrameTypeString";

export function castStackFrameType(
  type: "call",
): StackFrameType.CALL;
export function castStackFrameType(
  type: "tap",
): StackFrameType.TAP;
export function castStackFrameType(
  type: "trigger",
): StackFrameType.TRIGGER;
export function castStackFrameType(
  type: StackFrameTypeString,
): StackFrameType;
export function castStackFrameType(
  type: StackFrameTypeString,
): StackFrameType
{
  return type as StackFrameType;
}
