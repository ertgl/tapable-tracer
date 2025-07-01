import type { MermaidGraphCodeGenState } from "./MermaidGraphCodeGenState";

export function createMermaidGraphCodeGenState(): MermaidGraphCodeGenState
{
  return {
    edges: new Set(),
    nodeLabels: new Map(),
    nodeSequence: -1,
  };
}
