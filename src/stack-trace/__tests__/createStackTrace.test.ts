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
