import type { TapFrame } from "../TapFrame";

export type EncodableTapFrame = Omit<TapFrame, "wrapped">;
