import type { CallFrame } from "../CallFrame";
import { createCallFrame } from "../createCallFrame";
import { STACK_FRAME_TYPE_CALL } from "../type/STACK_FRAME_TYPE_CALL";

describe(
  "createCallFrame",
  () =>
  {
    it(
      "should return a new `CallFrame` object",
      () =>
      {
        const frameData: Omit<CallFrame, "type"> = {
          args: [],
          callee: "test",
          caller: null,
        };

        const frame = createCallFrame(frameData);

        expect(
          frame,
        ).toMatchObject({
          ...frameData,
          type: STACK_FRAME_TYPE_CALL,
        });
      },
    );
  },
);
