import { SyncHook } from "tapable";

import { HOOK_NAME_PRE_CALL } from "./HOOK_NAME_PRE_CALL";
import type { PreCallHook } from "./PreCallHook";

export function createPreCallHook(): PreCallHook
{
  return new SyncHook(
    [
      "payload",
    ],
    HOOK_NAME_PRE_CALL,
  );
}
