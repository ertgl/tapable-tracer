import type { HookLabel } from "../hook";

export type HookTracingOptions = {
  includeTrigger?: boolean | null;
  key?: HookLabel | null;
};
