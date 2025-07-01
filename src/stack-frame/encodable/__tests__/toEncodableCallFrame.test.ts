import type { CallFrame } from "../../CallFrame";
import { createCallFrame } from "../../createCallFrame";
import { STACK_FRAME_TYPE_CALL } from "../../type/STACK_FRAME_TYPE_CALL";
import type { EncodableCallFrame } from "../EncodableCallFrame";
import { toEncodableCallFrame } from "../toEncodableCallFrame";

describe(
  "toEncodableCallFrame",
  () =>
  {
    it(
      "should return an encodable object for the given frame",
      () =>
      {
        const encodableFrameData: Omit<EncodableCallFrame, "type"> = {
          callee: "test",
          caller: null,
        };

        const frameData: Omit<CallFrame, "type"> = {
          args: [],
          ...encodableFrameData,
        };

        const frame = createCallFrame(frameData);
        const encodableFrame = toEncodableCallFrame(frame);

        expect(
          encodableFrame,
        ).toMatchObject({
          ...encodableFrame,
          type: STACK_FRAME_TYPE_CALL,
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
