import type { SyncHook } from "tapable";

import type { PreCallHookPayload } from "./PreCallHookPayload";

export type PreCallHook = SyncHook<
  [
    payload: PreCallHookPayload,
  ]
>;
