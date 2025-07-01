import type { StackFrameLabel } from "../../../../../../stack-frame/label/StackFrameLabel";

export type MermaidGraphCodeGenState = {
  edges: Set<string>;
  nodeLabels: Map<StackFrameLabel, string>;
  nodeSequence: number;
};
