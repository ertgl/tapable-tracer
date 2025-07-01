import { createTriggerFrame } from "../../createTriggerFrame";
import type { TriggerFrame } from "../../TriggerFrame";
import { STACK_FRAME_TYPE_TRIGGER } from "../../type/STACK_FRAME_TYPE_TRIGGER";
import type { EncodableTriggerFrame } from "../EncodableTriggerFrame";
import { toEncodableTriggerFrame } from "../toEncodableTriggerFrame";

describe(
  "toEncodableTriggerFrame",
  () =>
  {
    it(
      "should return an encodable object for the given frame",
      () =>
      {
        const encodableFrameData: Omit<EncodableTriggerFrame, "type"> = {
          callee: "test",
          caller: null,
        };

        const frameData: Omit<TriggerFrame, "type"> = {
          args: [],
          ...encodableFrameData,
        };

        const frame = createTriggerFrame(frameData);
        const encodableFrame = toEncodableTriggerFrame(frame);

        expect(
          encodableFrame,
        ).toMatchObject({
          ...encodableFrame,
          type: STACK_FRAME_TYPE_TRIGGER,
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
