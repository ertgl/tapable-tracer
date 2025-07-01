import { createCallFrame } from "../../stack-frame/createCallFrame";
import { createTapFrame } from "../../stack-frame/createTapFrame";
import { createStackTrace } from "../createStackTrace";
import { pushStackFrame } from "../pushStackFrame";

describe(
  "pushStackFrame",
  () =>
  {
    it(
      "should append the given frame to the trace",
      () =>
      {
        const trace = createStackTrace();

        expect(trace.frames.length).toBe(0);

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

        expect(trace.frames.length).toBe(2);
      },
    );
  },
);
