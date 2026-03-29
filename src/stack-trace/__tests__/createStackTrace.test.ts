import {
  describe,
  expect,
  it,
} from "@jest/globals";

import { createStackTrace } from "../createStackTrace";

describe(
  "createStackTrace",
  () =>
  {
    it(
      "should return an empty array",
      () =>
      {
        const trace = createStackTrace();

        expect(trace).toMatchObject({
          frames: [],
        });
      },
    );
  },
);
