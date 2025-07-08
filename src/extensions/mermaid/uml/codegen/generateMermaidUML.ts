import type { EncodableStackFrame } from "../../../../stack-frame/encodable/EncodableStackFrame";
import { CONFIG_ELK } from "../lexemes/CONFIG_ELK";
import { LINE_FEED } from "../lexemes/LINE_FEED";

import { generateMermaidGraphForFrames } from "./graph/generateMermaidGraphForFrames";

export function generateMermaidUML(
  frames: EncodableStackFrame[],
): string
{
  let uml = `${CONFIG_ELK}${LINE_FEED}`;
  uml += generateMermaidGraphForFrames(frames);
  return uml;
}
