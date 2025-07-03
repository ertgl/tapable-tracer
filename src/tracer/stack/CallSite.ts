import type { FullTap } from "tapable";

import type { AnyHook } from "../../hook/AnyHook";
import type { HookCallback } from "../../hook/callback/HookCallback";

export type CallSite = {
  fn: HookCallback;
  hook: AnyHook;
  tap: FullTap;
};
