import type { SyncHook } from "tapable";

import type { PostCallHookPayload } from "./PostCallHookPayload";

export type PostCallHook = SyncHook<
  [
    payload: PostCallHookPayload,
  ]
>;
