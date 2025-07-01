import type { Compiler } from "webpack";

import { createTracer } from "../../../tracer/createTracer";
import type { Tracer } from "../../../tracer/Tracer";

import { PLUGIN_NAME_TAPABLE_TRACER } from "./PLUGIN_NAME_TAPABLE_TRACER";
import type { TapableTracerPluginOptions } from "./TapableTracerPluginOptions";

export class TapableTracerPlugin
{
  readonly options: TapableTracerPluginOptions;

  readonly tracer: Tracer;

  constructor(
    options?: null | TapableTracerPluginOptions,
  )
  {
    this.options = options ?? {};

    this.tracer = (
      this.options.tracerInstance
      ?? createTracer({
        interceptorName: PLUGIN_NAME_TAPABLE_TRACER,
        ...this.options.tracer,
      })
    );
  }

  apply(
    compiler: Compiler,
  ): void
  {
    for (const [key, hook] of Object.entries(compiler.hooks))
    {
      this.tracer.traceHook(
        hook,
        {
          includeTrigger: true,
          key,
        },
      );
    }

    compiler.hooks.done.tap(
      {
        name: PLUGIN_NAME_TAPABLE_TRACER,
        stage: Infinity,
      },
      () =>
      {
        this.options.callback?.(this.tracer);
      },
    );
  }
}
