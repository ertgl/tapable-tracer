import { createCallFrame } from "../../stack-frame/createCallFrame";
import { createTapFrame } from "../../stack-frame/createTapFrame";
import { createStackTrace } from "../createStackTrace";
import { dumpStackTrace } from "../dumpStackTrace";
import { pushStackFrame } from "../pushStackFrame";

describe(
  "dumpStackTrace",
  () =>
  {
    it(
      "should return an encodable array for the given trace",
      () =>
      {
        const trace = createStackTrace();

        pushStackFrame(
          trace,
          createTapFrame({
            hook: "frame1",
            tap: "frame2",
            wrapped: () => {},
          }),
        );

        pushStackFrame(
          trace,
          createCallFrame({
            args: [],
            callee: "frame1",
            caller: "frame2",
          }),
        );

        const encodableFrames = dumpStackTrace(trace);

        expect(encodableFrames.length).toBe(2);

        expect(
          () =>
          {
            JSON.stringify(encodableFrames);
          },
        ).not.toThrow();
      },
    );
  },
);
