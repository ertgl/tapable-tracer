import type { HookLabel } from "../../hook/label/HookLabel";

export type HookTracingOptions = {
  includeTrigger?: boolean | null;
  key?: HookLabel | null;
};
