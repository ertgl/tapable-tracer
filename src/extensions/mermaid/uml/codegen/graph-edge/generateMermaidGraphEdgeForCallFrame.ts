import type { EncodableCallFrame } from "../../../../../stack-frame/encodable/EncodableCallFrame";
import { LABEL_ROOT } from "../../../labels/LABEL_ROOT";
import type { MermaidGraphCodeGenState } from "../graph/state/MermaidGraphCodeGenState";

export function generateMermaidGraphEdgeForCallFrame(
  state: MermaidGraphCodeGenState,
  frame: EncodableCallFrame,
): string
{
  const callerNodeLabel = frame.caller ?? LABEL_ROOT;

  let callerNodeID = state.nodeLabels.get(callerNodeLabel);
  if (callerNodeID == null)
  {
    state.nodeSequence++;
    callerNodeID = `node${String(state.nodeSequence)}`;
    state.nodeLabels.set(
      callerNodeLabel,
      callerNodeID,
    );
  }

  let calleeNodeID = state.nodeLabels.get(frame.callee);
  if (calleeNodeID == null)
  {
    state.nodeSequence++;
    calleeNodeID = `node${String(state.nodeSequence)}`;
    state.nodeLabels.set(
      frame.callee,
      calleeNodeID,
    );
  }

  return `${callerNodeID}[[ ${callerNodeLabel} ]] -->|${frame.type}| ${calleeNodeID}[[ ${frame.callee} ]]`;
}
