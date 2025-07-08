import type { TracerOptions } from "../../../tracer/options/TracerOptions";
import type { Tracer } from "../../../tracer/Tracer";
import type { DoneCallback } from "../callbacks/done/DoneCallback";

export type TapableTracerPluginOptions = {
  callback?: DoneCallback | null;
  tracer?: null | TracerOptions;
  tracerInstance?: null | Tracer;
};
