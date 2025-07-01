import { SyncHook } from "tapable";

import { createTracer } from "../createTracer";
import { traceHook } from "../traceHook";

describe(
  "traceHook",
  () =>
  {
    it(
      "should add an interceptor to the given hook for tracing",
      () =>
      {
        const hook = new SyncHook<[]>([]);

        expect(hook.interceptors.length).toBe(0);

        const tracer = createTracer();

        traceHook(
          tracer,
          hook,
        );

        expect(hook.interceptors.length).toBe(1);
      },
    );
  },
);
