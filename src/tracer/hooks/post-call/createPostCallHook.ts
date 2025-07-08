import { SyncHook } from "tapable";

import { HOOK_NAME_POST_CALL } from "./HOOK_NAME_POST_CALL";
import type { PostCallHook } from "./PostCallHook";

export function createPostCallHook(): PostCallHook
{
  return new SyncHook(
    [
      "payload",
    ],
    HOOK_NAME_POST_CALL,
  );
}
