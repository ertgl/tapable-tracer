import { jest } from "@jest/globals";
import {
  AsyncSeriesHook,
  type FullTap,
  SyncHook,
} from "tapable";

import type { CallFrame } from "../../stack-frame/CallFrame";
import type { TapFrame } from "../../stack-frame/TapFrame";
import { STACK_FRAME_TYPE_CALL } from "../../stack-frame/type/STACK_FRAME_TYPE_CALL";
import { STACK_FRAME_TYPE_TAP } from "../../stack-frame/type/STACK_FRAME_TYPE_TAP";
import { Tracer } from "../Tracer";

describe(
  "Tracer",
  () =>
  {
    describe(
      "_getOrCreateLabelForHook",
      () =>
      {
        it(
          "should return the hook name if it is defined",
          () =>
          {
            const hookName = "known";
            const hook = new SyncHook<[]>([], hookName);

            expect(hook.name).toBe(hookName);

            const tracer = new Tracer();

            const label = tracer._getOrCreateLabelForHook(
              hook,
              {},
            );

            expect(label).toBe(hookName);
          },
        );

        it(
          "should create a new label if the given hook has no name",
          () =>
          {
            const hook = new SyncHook<[]>([]);

            expect(hook.name).toEqual(undefined);

            const tracer = new Tracer();

            const label = tracer._getOrCreateLabelForHook(
              hook,
              {},
            );

            expect(label).toBeDefined();
          },
        );

        it(
          "should create a new label using a custom labeller",
          () =>
          {
            const hook1 = new SyncHook<[]>([]);
            expect(hook1.name).toEqual(undefined);

            const hook2 = new SyncHook<[]>([]);
            expect(hook2.name).toEqual(undefined);

            const tracer = new Tracer({
              labelHook: (
                hook,
                sequence,
              ) =>
              {
                return `Hook #${String(sequence)}`;
              },
            });

            const label1 = tracer._getOrCreateLabelForHook(
              hook1,
              {},
            );

            expect(label1).toBe("Hook #0");

            const label2 = tracer._getOrCreateLabelForHook(
              hook1,
              {},
            );

            expect(label2).toBe("Hook #0");

            const label3 = tracer._getOrCreateLabelForHook(
              hook2,
              {},
            );

            expect(label3).toBe("Hook #1");
          },
        );
      },
    );

    describe(
      "_getOrCreateLabelForTap",
      () =>
      {
        it(
          "should return the tap name if it is defined",
          () =>
          {
            const tracer = new Tracer();

            const hook = new SyncHook<[]>([]);

            const tapName = "test";

            const registerMocked = jest.fn(
              (
                tap: FullTap,
              ) =>
              {
                expect(
                  tracer._getOrCreateLabelForTap(
                    hook,
                    tap,
                    {},
                  ),
                ).toBe(
                  tapName,
                );

                return tap;
              },
            );

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
          "should create a new label if the given tap has no name",
          () =>
          {
            const tracer = new Tracer();

            const hook = new SyncHook<[]>([]);

            const registerMocked = jest.fn(
              (
                tap: FullTap,
              ) =>
              {
                tap.name = "";

                expect(
                  tracer._getOrCreateLabelForTap(
                    hook,
                    tap,
                    {},
                  ),
                ).toBeTruthy();

                return tap;
              },
            );

            hook.intercept({
              register: registerMocked,
            });

            hook.tap(
              {
                name: "test",
              },
              () => {},
            );

            expect(registerMocked).toHaveBeenCalledTimes(1);
          },
        );

        it(
          "should create a new label using a custom labeller",
          () =>
          {
            const hook1 = new SyncHook<[]>([]);
            expect(hook1.name).toEqual(undefined);

            const hook2 = new SyncHook<[]>([]);
            expect(hook2.name).toEqual(undefined);

            const tracer = new Tracer({
              labelTap: (
                hook,
                tap,
                sequence,
              ) =>
              {
                return `Tap #${String(sequence)}`;
              },
            });

            const registerMocked = jest.fn(
              (
                tap: FullTap,
              ) =>
              {
                const label1 = tracer._getOrCreateLabelForTap(
                  hook1,
                  tap,
                  {},
                );

                expect(label1).toBe("Tap #0");

                const label2 = tracer._getOrCreateLabelForTap(
                  hook1,
                  tap,
                  {},
                );

                expect(label2).toBe("Tap #1");

                const label3 = tracer._getOrCreateLabelForTap(
                  hook2,
                  tap,
                  {},
                );

                expect(label3).toBe("Tap #2");

                return tap;
              },
            );

            hook1.intercept({
              register: registerMocked,
            });

            hook1.tap(
              {
                name: "test",
              },
              () => {},
            );

            expect(registerMocked).toHaveBeenCalledTimes(1);
          },
        );
      },
    );

    describe(
      "handleCall",
      () =>
      {
        it(
          "should update the stack trace with the sync call",
          () =>
          {
            const tracer = new Tracer();

            const hook1 = new SyncHook<[]>([], "hook1");
            tracer.traceHook(hook1);

            const hook2 = new SyncHook<[]>([], "hook2");
            tracer.traceHook(hook2);

            const hook3 = new SyncHook<[]>([], "hook3");
            tracer.traceHook(hook3);

            const hook4 = new SyncHook<[]>([], "hook4");
            tracer.traceHook(hook4);

            hook1.tap(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              hook2.name!,
              () =>
              {
                hook2.call();
              },
            );

            hook2.tap(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              hook3.name!,
              () =>
              {
                hook3.call();
              },
            );

            hook3.tap(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              hook4.name!,
              () =>
              {
                hook4.call();
              },
            );

            expect(tracer.trace.frames.length).toBe(3);

            hook1.call();

            expect(tracer.trace.frames.length).toBe(7);

            expect(tracer.trace.frames[0]).toMatchObject(
              {
                hook: "hook1",
                tap: "hook2",
                type: STACK_FRAME_TYPE_TAP,
              } satisfies Partial<TapFrame>,
            );

            expect(tracer.trace.frames[1]).toMatchObject(
              {
                hook: "hook2",
                tap: "hook3",
                type: STACK_FRAME_TYPE_TAP,
              } satisfies Partial<TapFrame>,
            );

            expect(tracer.trace.frames[2]).toMatchObject(
              {
                hook: "hook3",
                tap: "hook4",
                type: STACK_FRAME_TYPE_TAP,
              } satisfies Partial<TapFrame>,
            );

            expect(tracer.trace.frames[3]).toMatchObject(
              {
                callee: "hook1",
                caller: null,
                type: STACK_FRAME_TYPE_CALL,
              } satisfies Partial<CallFrame>,
            );

            expect(tracer.trace.frames[4]).toMatchObject(
              {
                callee: "hook2",
                caller: "hook1",
                type: STACK_FRAME_TYPE_CALL,
              } satisfies Partial<CallFrame>,
            );

            expect(tracer.trace.frames[5]).toMatchObject(
              {
                callee: "hook3",
                caller: "hook2",
                type: STACK_FRAME_TYPE_CALL,
              } satisfies Partial<CallFrame>,
            );

            expect(tracer.trace.frames[6]).toMatchObject(
              {
                callee: "hook4",
                caller: "hook3",
                type: STACK_FRAME_TYPE_CALL,
              } satisfies Partial<CallFrame>,
            );
          },
        );

        it(
          "should update the stack trace with the async call",
          () =>
          {
            const tracer = new Tracer();

            const hook1 = new AsyncSeriesHook<[]>([], "hook1");
            tracer.traceHook(hook1);

            const hook2 = new AsyncSeriesHook<[]>([], "hook2");
            tracer.traceHook(hook2);

            const hook3 = new AsyncSeriesHook<[]>([], "hook3");
            tracer.traceHook(hook3);

            const hook4 = new AsyncSeriesHook<[]>([], "hook4");
            tracer.traceHook(hook4);

            hook1.tapAsync(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              hook2.name!,
              (callback) =>
              {
                hook2.callAsync(callback);
              },
            );

            hook2.tapAsync(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              hook3.name!,
              (callback) =>
              {
                hook3.callAsync(callback);
              },
            );

            hook3.tapAsync(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              hook4.name!,
              (callback) =>
              {
                hook4.callAsync(callback);
              },
            );

            expect(tracer.trace.frames.length).toBe(3);

            const callbackMocked = jest.fn(
              (
                err: Error | null,
              ) =>
              {
                expect(tracer.trace.frames.length).toBe(7);

                expect(tracer.trace.frames[0]).toMatchObject(
                  {
                    hook: "hook1",
                    tap: "hook2",
                    type: STACK_FRAME_TYPE_TAP,
                  } satisfies Partial<TapFrame>,
                );

                expect(tracer.trace.frames[1]).toMatchObject(
                  {
                    hook: "hook2",
                    tap: "hook3",
                    type: STACK_FRAME_TYPE_TAP,
                  } satisfies Partial<TapFrame>,
                );

                expect(tracer.trace.frames[2]).toMatchObject(
                  {
                    hook: "hook3",
                    tap: "hook4",
                    type: STACK_FRAME_TYPE_TAP,
                  } satisfies Partial<TapFrame>,
                );

                expect(tracer.trace.frames[3]).toMatchObject(
                  {
                    callee: "hook1",
                    caller: null,
                    type: STACK_FRAME_TYPE_CALL,
                  } satisfies Partial<CallFrame>,
                );

                expect(tracer.trace.frames[4]).toMatchObject(
                  {
                    callee: "hook2",
                    caller: "hook1",
                    type: STACK_FRAME_TYPE_CALL,
                  } satisfies Partial<CallFrame>,
                );

                expect(tracer.trace.frames[5]).toMatchObject(
                  {
                    callee: "hook3",
                    caller: "hook2",
                    type: STACK_FRAME_TYPE_CALL,
                  } satisfies Partial<CallFrame>,
                );

                expect(tracer.trace.frames[6]).toMatchObject(
                  {
                    callee: "hook4",
                    caller: "hook3",
                    type: STACK_FRAME_TYPE_CALL,
                  } satisfies Partial<CallFrame>,
                );
              },
            );

            hook1.callAsync(callbackMocked);

            expect(callbackMocked).toHaveBeenCalledTimes(1);
          },
        );

        it(
          "should update the stack trace with the promise call",
          async () =>
          {
            const tracer = new Tracer();

            const hook1 = new AsyncSeriesHook<[]>([], "hook1");
            tracer.traceHook(hook1);

            const hook2 = new AsyncSeriesHook<[]>([], "hook2");
            tracer.traceHook(hook2);

            const hook3 = new AsyncSeriesHook<[]>([], "hook3");
            tracer.traceHook(hook3);

            const hook4 = new AsyncSeriesHook<[]>([], "hook4");
            tracer.traceHook(hook4);

            hook1.tapPromise(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              hook2.name!,
              async () =>
              {
                await hook2.promise();
              },
            );

            hook2.tapPromise(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              hook3.name!,
              async () =>
              {
                await hook3.promise();
              },
            );

            hook3.tapPromise(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              hook4.name!,
              async () =>
              {
                await hook4.promise();
              },
            );

            expect(tracer.trace.frames.length).toBe(3);

            await hook1.promise();

            expect(tracer.trace.frames.length).toBe(7);

            expect(tracer.trace.frames[0]).toMatchObject(
              {
                hook: "hook1",
                tap: "hook2",
                type: STACK_FRAME_TYPE_TAP,
              } satisfies Partial<TapFrame>,
            );

            expect(tracer.trace.frames[1]).toMatchObject(
              {
                hook: "hook2",
                tap: "hook3",
                type: STACK_FRAME_TYPE_TAP,
              } satisfies Partial<TapFrame>,
            );

            expect(tracer.trace.frames[2]).toMatchObject(
              {
                hook: "hook3",
                tap: "hook4",
                type: STACK_FRAME_TYPE_TAP,
              } satisfies Partial<TapFrame>,
            );

            expect(tracer.trace.frames[3]).toMatchObject(
              {
                callee: "hook1",
                caller: null,
                type: STACK_FRAME_TYPE_CALL,
              } satisfies Partial<CallFrame>,
            );

            expect(tracer.trace.frames[4]).toMatchObject(
              {
                callee: "hook2",
                caller: "hook1",
                type: STACK_FRAME_TYPE_CALL,
              } satisfies Partial<CallFrame>,
            );

            expect(tracer.trace.frames[5]).toMatchObject(
              {
                callee: "hook3",
                caller: "hook2",
                type: STACK_FRAME_TYPE_CALL,
              } satisfies Partial<CallFrame>,
            );

            expect(tracer.trace.frames[6]).toMatchObject(
              {
                callee: "hook4",
                caller: "hook3",
                type: STACK_FRAME_TYPE_CALL,
              } satisfies Partial<CallFrame>,
            );
          },
        );
      },
    );

    describe(
      "traceHook",
      () =>
      {
        it(
          "should add an interceptor to the given hook for tracing",
          () =>
          {
            const hook = new SyncHook<[]>([]);

            expect(hook.interceptors.length).toBe(0);

            const tracer = new Tracer();
            tracer.traceHook(hook);

            expect(hook.interceptors.length).toBe(1);
          },
        );
      },
    );
  },
);
