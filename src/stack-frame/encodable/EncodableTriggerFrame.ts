import type { TriggerFrame } from "../TriggerFrame";

export type EncodableTriggerFrame = Omit<TriggerFrame, "args">;
