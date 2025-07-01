import type { EncodableStackFrame } from "../../../../../stack-frame/encodable/EncodableStackFrame";
import { LINE_FEED } from "../../lexemes";
import { GRAPH_HEADER_LINE } from "../../lexemes/GRAPH_HEADER_LINE";
import { INDENT } from "../../lexemes/INDENT";
import { generateMermaidGraphEdgeForStackFrame } from "../graph-edge/generateMermaidGraphEdgeForStackFrame";

import { createMermaidGraphCodeGenState } from "./state/createMermaidGraphCodeGenState";

export function generateMermaidGraphForFrames(
  frames: EncodableStackFrame[],
): string
{
  const state = createMermaidGraphCodeGenState();

  let graph = GRAPH_HEADER_LINE;

  for (const frame of frames)
  {
    const edge = generateMermaidGraphEdgeForStackFrame(
      state,
      frame,
    );

    state.edges.add(edge);
  }

  for (const edge of state.edges)
  {
    graph += `${INDENT}${edge}${LINE_FEED}`;
  }

  return graph;
}
