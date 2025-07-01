import type { TapFrame } from "../TapFrame";

import type { EncodableTapFrame } from "./EncodableTapFrame";

export function toEncodableTapFrame(
  frame: TapFrame,
): EncodableTapFrame
{
  return {
    hook: frame.hook,
    tap: frame.tap,
    type: frame.type,
  };
}
