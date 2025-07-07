import { createHandleStackFrameHook } from "../../hooks/handle-stack-frame/createHandleStackFrameHook";
import { createPostCallHook } from "../../hooks/post-call/createPostCallHook";
import { createPreCallHook } from "../../hooks/pre-call/createPreCallHook";

import type { TracerHookRegistry } from "./TracerHookRegistry";

export function createTracerHookRegistry(): TracerHookRegistry
{
  return {
    handleStackFrame: createHandleStackFrameHook(),
    postCall: createPostCallHook(),
    preCall: createPreCallHook(),
  };
}
