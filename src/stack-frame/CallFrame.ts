import type { HookLabel } from "../hook/label/HookLabel";

import type { StackFrameLabel } from "./label/StackFrameLabel";
import type { StackFrameType } from "./type/StackFrameType";

export type CallFrame = {
  args: unknown[];
  callee: HookLabel;
  caller: null | StackFrameLabel;
  type: StackFrameType.CALL;
};
