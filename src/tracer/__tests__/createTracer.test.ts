import { createTracer } from "../createTracer";
import { Tracer } from "../Tracer";

describe(
  "createTracer",
  () =>
  {
    it(
      "should return a new `Tracer` instance",
      () =>
      {
        const tracer1 = createTracer();
        expect(tracer1).toBeInstanceOf(Tracer);

        const tracer2 = createTracer();
        expect(tracer2).toBeInstanceOf(Tracer);

        expect(tracer1).not.toBe(tracer2);
      },
    );
  },
);
