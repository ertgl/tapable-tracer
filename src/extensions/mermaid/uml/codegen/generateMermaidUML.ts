import type { EncodableStackFrame } from "../../../../stack-frame/encodable/EncodableStackFrame";
import { LINE_FEED } from "../lexemes";
import { CONFIG_ELK } from "../lexemes/CONFIG_ELK";

import { generateMermaidGraphForFrames } from "./graph/generateMermaidGraphForFrames";

export function generateMermaidUML(
  frames: EncodableStackFrame[],
): string
{
  let uml = `${CONFIG_ELK}${LINE_FEED}`;
  uml += generateMermaidGraphForFrames(frames);
  return uml;
}
