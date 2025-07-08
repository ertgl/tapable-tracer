import type { HookLabellerFunction } from "../../hook/label/HookLabellerFunction";
import type { TapLabellerFunction } from "../../tap/label/TapLabellerFunction";

export type TracerOptions = {
  interceptorName?: null | string;
  labelHook?: HookLabellerFunction | null;
  labelTap?: null | TapLabellerFunction;
};
