import type { EncodableTapFrame } from "../../../../../stack-frame/encodable/EncodableTapFrame";
import type { MermaidGraphCodeGenState } from "../graph/state/MermaidGraphCodeGenState";

export function generateMermaidGraphEdgeForTapFrame(
  state: MermaidGraphCodeGenState,
  frame: EncodableTapFrame,
): string
{
  let tapNodeID = state.nodeLabels.get(frame.tap);
  if (tapNodeID == null)
  {
    state.nodeSequence++;
    tapNodeID = `node${String(state.nodeSequence)}`;
    state.nodeLabels.set(
      frame.tap,
      tapNodeID,
    );
  }

  let hookNodeID = state.nodeLabels.get(frame.hook);
  if (hookNodeID == null)
  {
    state.nodeSequence++;
    hookNodeID = `node${String(state.nodeSequence)}`;
    state.nodeLabels.set(
      frame.hook,
      hookNodeID,
    );
  }

  return `${tapNodeID}[[ ${frame.tap} ]] -->|${frame.type}| ${hookNodeID}[[ ${frame.hook} ]]`;
}
