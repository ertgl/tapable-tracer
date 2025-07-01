import type { EncodableStackFrame } from "../../../../../stack-frame/encodable/EncodableStackFrame";
import { STACK_FRAME_TYPE_TAP } from "../../../../../stack-frame/type/STACK_FRAME_TYPE_TAP";
import { STACK_FRAME_TYPE_TRIGGER } from "../../../../../stack-frame/type/STACK_FRAME_TYPE_TRIGGER";
import type { MermaidGraphCodeGenState } from "../graph/state/MermaidGraphCodeGenState";

import { generateMermaidGraphEdgeForCallFrame } from "./generateMermaidGraphEdgeForCallFrame";
import { generateMermaidGraphEdgeForTapFrame } from "./generateMermaidGraphEdgeForTapFrame";
import { generateMermaidGraphEdgeForTriggerFrame } from "./generateMermaidGraphEdgeForTriggerFrame";

export function generateMermaidGraphEdgeForStackFrame(
  state: MermaidGraphCodeGenState,
  frame: EncodableStackFrame,
): string
{
  if (frame.type === STACK_FRAME_TYPE_TAP)
  {
    return generateMermaidGraphEdgeForTapFrame(
      state,
      frame,
    );
  }

  else if (frame.type === STACK_FRAME_TYPE_TRIGGER)
  {
    return generateMermaidGraphEdgeForTriggerFrame(
      state,
      frame,
    );
  }

  return generateMermaidGraphEdgeForCallFrame(
    state,
    frame,
  );
}
