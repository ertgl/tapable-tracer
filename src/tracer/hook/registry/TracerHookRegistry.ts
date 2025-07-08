import type { HandleStackFrameHook } from "../../hooks/handle-stack-frame/HandleStackFrameHook";
import type { PostCallHook } from "../../hooks/post-call/PostCallHook";
import type { PreCallHook } from "../../hooks/pre-call/PreCallHook";

export type TracerHookRegistry = {
  handleStackFrame: HandleStackFrameHook;
  postCall: PostCallHook;
  preCall: PreCallHook;
};
