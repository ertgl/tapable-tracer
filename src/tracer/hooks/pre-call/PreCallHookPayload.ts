import type { FullTap } from "tapable";

import type { AnyHook } from "../../../hook/AnyHook";
import type { HookCallback } from "../../../hook/callback/HookCallback";
import type { HookTracingOptions } from "../../options/HookTracingOptions";

export type PreCallHookPayload = {
  fn: HookCallback;
  hook: AnyHook;
  options: HookTracingOptions;
  tap: FullTap;
};
