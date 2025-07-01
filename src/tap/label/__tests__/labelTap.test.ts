import { jest } from "@jest/globals";
import {
  type FullTap,
  SyncHook,
} from "tapable";

import { labelTap } from "../labelTap";

describe(
  "labelTap",
  () =>
  {
    it(
      "should return the tap name as is when it is defined",
      () =>
      {
        const tapName = "test";

        const registerMocked = jest.fn(
          (
            tap: FullTap,
          ) =>
          {
            expect(
              labelTap(
                hook,
                tap,
                0,
              ),
            ).toBe(
              "test",
            );

            expect(
              labelTap(
                hook,
                tap,
                1,
              ),
            ).toBe(
              "test",
            );

            return tap;
          },
        );

        const hook = new SyncHook<[]>([]);

        hook.intercept({
          register: registerMocked,
        });

        hook.tap(
          {
            name: tapName,
          },
          () => {},
        );

        expect(registerMocked).toHaveBeenCalledTimes(1);
      },
    );

    it(
      "should return a generated label for the given tap if its name is falsy",
      () =>
      {
        const tapName = "test";

        const registerMocked = jest.fn(
          (
            tap: FullTap,
          ) =>
          {
            tap.name = "";

            tap.name = labelTap(
              hook,
              tap,
              0,
            );

            expect(
              tap.name,
            ).toBe(
              "Unknown tap #0",
            );

            return tap;
          },
        );

        const hook = new SyncHook<[]>([]);

        hook.intercept({
          register: registerMocked,
        });

        hook.tap(
          {
            name: tapName,
          },
          () => {},
        );

        expect(registerMocked).toHaveBeenCalledTimes(1);
      },
    );
  },
);
