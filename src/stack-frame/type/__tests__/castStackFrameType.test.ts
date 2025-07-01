import { castStackFrameType } from "../castStackFrameType";
import { STACK_FRAME_TYPE_CALL } from "../STACK_FRAME_TYPE_CALL";
import { STACK_FRAME_TYPE_TAP } from "../STACK_FRAME_TYPE_TAP";
import { STACK_FRAME_TYPE_TRIGGER } from "../STACK_FRAME_TYPE_TRIGGER";

describe(
  "castStackFrameType",
  () =>
  {
    it(
      "should return the given value as is",
      () =>
      {
        expect(
          castStackFrameType(
            "call",
          ),
        ).toStrictEqual(
          STACK_FRAME_TYPE_CALL,
        );

        expect(
          castStackFrameType(
            "tap",
          ),
        ).toStrictEqual(
          STACK_FRAME_TYPE_TAP,
        );

        expect(
          castStackFrameType(
            "trigger",
          ),
        ).toStrictEqual(
          STACK_FRAME_TYPE_TRIGGER,
        );
      },
    );
  },
);
