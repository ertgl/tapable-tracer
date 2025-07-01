import { createTapFrame } from "../../createTapFrame";
import type { TapFrame } from "../../TapFrame";
import { STACK_FRAME_TYPE_TAP } from "../../type/STACK_FRAME_TYPE_TAP";
import type { EncodableTapFrame } from "../EncodableTapFrame";
import { toEncodableTapFrame } from "../toEncodableTapFrame";

describe(
  "toEncodableTapFrame",
  () =>
  {
    it(
      "should return an encodable object for the given frame",
      () =>
      {
        const encodableFrameData: Omit<EncodableTapFrame, "type"> = {
          hook: "frame1",
          tap: "frame2",
        };

        const frameData: Omit<TapFrame, "type"> = {
          wrapped: () => {},
          ...encodableFrameData,
        };

        const frame = createTapFrame(frameData);
        const encodableFrame = toEncodableTapFrame(frame);

        expect(
          encodableFrame,
        ).toMatchObject({
          ...encodableFrame,
          type: STACK_FRAME_TYPE_TAP,
        });

        expect(
          () =>
          {
            JSON.stringify(encodableFrame);
          },
        ).not.toThrow();
      },
    );
  },
);
