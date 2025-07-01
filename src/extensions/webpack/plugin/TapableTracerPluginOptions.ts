import type { Tracer } from "../../../tracer/Tracer";
import type { TracerOptions } from "../../../tracer/TracerOptions";
import type { DoneCallback } from "../callbacks";

export type TapableTracerPluginOptions = {
  callback?: DoneCallback | null;
  tracer?: null | TracerOptions;
  tracerInstance?: null | Tracer;
};
