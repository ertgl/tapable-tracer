import type { SyncHook } from "tapable";

import type { HandleStackFrameHookPayload } from "./HandleStackFrameHookPayload";

export type HandleStackFrameHook = SyncHook<
  [
    payload: HandleStackFrameHookPayload,
  ]
>;
