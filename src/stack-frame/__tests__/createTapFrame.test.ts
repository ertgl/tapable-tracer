import { createTapFrame } from "../createTapFrame";
import type { TapFrame } from "../TapFrame";
import { STACK_FRAME_TYPE_TAP } from "../type/STACK_FRAME_TYPE_TAP";

describe(
  "createTapFrame",
  () =>
  {
    it(
      "should return a new `TapFrame` object",
      () =>
      {
        const frameData: Omit<TapFrame, "type"> = {
          hook: "frame1",
          tap: "frame2",
          wrapped: () => {},
        };

        const frame = createTapFrame(frameData);

        expect(
          frame,
        ).toMatchObject({
          ...frameData,
          type: STACK_FRAME_TYPE_TAP,
        });
      },
    );
  },
);
