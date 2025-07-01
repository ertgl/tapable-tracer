import type { HookLabel } from "../hook/label/HookLabel";
import type { TapLabel } from "../tap/label/TapLabel";

import type { StackFrameType } from "./type/StackFrameType";

export type TapFrame = {
  hook: HookLabel;
  tap: TapLabel;
  type: StackFrameType.TAP;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  wrapped: Function;
};
