import { SyncHook } from "tapable";

import type { HandleStackFrameHook } from "./HandleStackFrameHook";
import { HOOK_NAME_HANDLE_STACK_FRAME } from "./HOOK_NAME_HANDLE_STACK_FRAME";

export function createHandleStackFrameHook(): HandleStackFrameHook
{
  return new SyncHook(
    [
      "payload",
    ],
    HOOK_NAME_HANDLE_STACK_FRAME,
  );
}
