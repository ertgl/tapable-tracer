import type { CallFrame } from "../CallFrame";

export type EncodableCallFrame = Omit<CallFrame, "args">;
