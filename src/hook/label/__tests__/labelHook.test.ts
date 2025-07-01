import { SyncHook } from "tapable";

import { labelHook } from "../labelHook";

describe(
  "labelHook",
  () =>
  {
    it(
      "should return the hook name as is when it is defined",
      () =>
      {
        const hook = new SyncHook<[]>([], "test");

        expect(
          labelHook(
            hook,
            1,
            {},
          ),
        ).toBe(
          "test",
        );
      },
    );

    it(
      "should return a generated label for the given hook if its name is falsy",
      () =>
      {
        const hook = new SyncHook<[]>([]);

        expect(
          labelHook(
            hook,
            1,
            {},
          ),
        ).toBe(
          "Unknown hook #1",
        );

        expect(
          labelHook(
            hook,
            2,
            {},
          ),
        ).toBe(
          "Unknown hook #2",
        );
      },
    );
  },
);
