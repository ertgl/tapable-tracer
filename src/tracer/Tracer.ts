import type { FullTap } from "tapable";

import type { AnyHook } from "../hook/AnyHook";
import type { HookCallback } from "../hook/callback/HookCallback";
import type { HookLabel } from "../hook/label/HookLabel";
import { labelHook } from "../hook/label/labelHook";
import type { CallFrame } from "../stack-frame/CallFrame";
import { createCallFrame } from "../stack-frame/createCallFrame";
import { createTapFrame } from "../stack-frame/createTapFrame";
import { createTriggerFrame } from "../stack-frame/createTriggerFrame";
import type { EncodableStackFrame } from "../stack-frame/encodable/EncodableStackFrame";
import type { StackFrameLabel } from "../stack-frame/label/StackFrameLabel";
import type { StackFrame } from "../stack-frame/StackFrame";
import type { TapFrame } from "../stack-frame/TapFrame";
import type { TriggerFrame } from "../stack-frame/TriggerFrame";
import { STACK_FRAME_TYPE_CALL } from "../stack-frame/type/STACK_FRAME_TYPE_CALL";
import { STACK_FRAME_TYPE_TAP } from "../stack-frame/type/STACK_FRAME_TYPE_TAP";
import { STACK_FRAME_TYPE_TRIGGER } from "../stack-frame/type/STACK_FRAME_TYPE_TRIGGER";
import { createStackTrace } from "../stack-trace/createStackTrace";
import { dumpStackTrace } from "../stack-trace/dumpStackTrace";
import { pushStackFrame } from "../stack-trace/pushStackFrame";
import type { StackTrace } from "../stack-trace/StackTrace";
import { labelTap } from "../tap/label/labelTap";
import type { TapLabel } from "../tap/label/TapLabel";

import type { HookTracingOptions } from "./HookTracingOptions";
import type { TracerOptions } from "./TracerOptions";

export class Tracer
{
  labelSequence: number;

  readonly options: TracerOptions;

  readonly stack: StackFrame[];

  tapSequence: number;

  readonly trace: StackTrace;

  readonly unknownHookLabels: WeakMap<AnyHook, HookLabel>;

  constructor(
    options?: null | TracerOptions,
  )
  {
    this.options = options ?? {};

    this.labelSequence = -1;
    this.tapSequence = -1;

    this.unknownHookLabels = new WeakMap();

    this.stack = [];
    this.trace = createStackTrace();
  }

  _callAsync(
    frame: TapFrame,
    superFn: HookCallback,
    args: unknown[],
  ): unknown
  {
    this.stack.push(frame);

    const callback = (
      ...callbackArgs: unknown[]
    ): void =>
    {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-function-type
      (args[args.length - 1] as Function)(...callbackArgs);

      this.stack.pop();
    };

    const result: unknown = superFn(
      ...args.slice(0, args.length - 1),
      callback,
    );

    return result;
  }

  async _callPromise(
    frame: TapFrame,
    superFn: HookCallback,
    args: unknown[],
  ): Promise<unknown>
  {
    this.stack.push(frame);

    const maybePromise: unknown = superFn(...args);

    const result: unknown = (
      maybePromise instanceof Promise
        ? await maybePromise
        : maybePromise
    );

    this.stack.pop();

    return result;
  }

  _callSync(
    frame: TapFrame,
    superFn: HookCallback,
    args: unknown[],
  ): unknown
  {
    this.stack.push(frame);
    const result: unknown = superFn(...args);
    this.stack.pop();

    return result;
  }

  _getInterceptorName(): string | undefined
  {
    return this.options.interceptorName ?? undefined;
  }

  _getOrCreateLabelForHook(
    hook: AnyHook,
    options: HookTracingOptions,
  ): HookLabel
  {
    let label = this.unknownHookLabels.get(hook);

    if (label == null)
    {
      this.labelSequence++;

      label = (
        this.options.labelHook
        ?? labelHook
      )(
        hook,
        this.labelSequence,
        options,
      );

      this.unknownHookLabels.set(
        hook,
        label,
      );
    }

    return label;
  }

  _getOrCreateLabelForTap(
    hook: AnyHook,
    tap: FullTap,
    options: HookTracingOptions,
  ): TapLabel
  {
    this.tapSequence++;

    return (
      this.options.labelTap
      ?? labelTap
    )(
      hook,
      tap,
      this.tapSequence,
      options,
    );
  }

  _getPreviousFrameLabel(
    options: HookTracingOptions,
  ): null | StackFrameLabel
  {
    const previousFrame = this.stack[this.stack.length - 1] as StackFrame | undefined;

    if (previousFrame == null)
    {
      return null;
    }

    let label: null | StackFrameLabel = null;

    if (previousFrame.type === STACK_FRAME_TYPE_CALL)
    {
      label = previousFrame.callee;
    }
    else if (previousFrame.type === STACK_FRAME_TYPE_TRIGGER)
    {
      label = previousFrame.callee;
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    else if (previousFrame.type === STACK_FRAME_TYPE_TAP)
    {
      label = (
        options.includeTrigger
          ? previousFrame.tap
          : previousFrame.hook
      );
    }

    return label;
  }

  dump(): EncodableStackFrame[]
  {
    return dumpStackTrace(this.trace);
  }

  handleCall(
    hook: AnyHook,
    options: HookTracingOptions,
    ...args: unknown[]
  ): void
  {
    this.pushCallFrame(
      hook,
      null,
      args,
      options,
    );
  }

  handleTap(
    hook: AnyHook,
    tap: FullTap,
    options?: HookTracingOptions | null,
  ): void
  {
    options ??= {};

    const frame = this.pushTapFrame(
      hook,
      tap,
      tap.fn as HookCallback,
      options,
    );

    if (tap.type === "async")
    {
      this.wrapTapAsync(
        hook,
        tap,
        frame,
        tap.fn as HookCallback,
        options,
      );
    }
    else if (tap.type === "promise")
    {
      this.wrapTapPromise(
        hook,
        tap,
        frame,
        tap.fn as HookCallback,
        options,
      );
    }
    else
    {
      this.wrapTapSync(
        hook,
        tap,
        frame,
        tap.fn as HookCallback,
        options,
      );
    }
  }

  pushCallFrame(
    hook: AnyHook,
    tap: FullTap | null,
    args: unknown[],
    options: HookTracingOptions,
  ): CallFrame
  {
    const frame = createCallFrame({
      args,
      callee: this._getOrCreateLabelForHook(
        hook,
        options,
      ),
      caller: this._getPreviousFrameLabel(options),
    });

    pushStackFrame(
      this.trace,
      frame,
    );

    this.options.handleStackFrame?.(
      hook,
      tap,
      frame,
      options,
    );

    return frame;
  }

  pushTapFrame(
    hook: AnyHook,
    tap: FullTap,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    wrapped: Function,
    options: HookTracingOptions,
  ): TapFrame
  {
    const frame = createTapFrame({
      hook: this._getOrCreateLabelForHook(
        hook,
        options,
      ),
      tap: this._getOrCreateLabelForTap(
        hook,
        tap,
        options,
      ),
      wrapped,
    });

    pushStackFrame(
      this.trace,
      frame,
    );

    this.options.handleStackFrame?.(
      hook,
      tap,
      frame,
      options,
    );

    return frame;
  }

  pushTriggerFrame(
    hook: AnyHook,
    tap: FullTap,
    tapFrame: TapFrame,
    args: unknown[],
    options: HookTracingOptions,
  ): TriggerFrame
  {
    const frame = createTriggerFrame({
      args,
      callee: tapFrame.tap,
      caller: tapFrame.hook,
    });

    pushStackFrame(
      this.trace,
      frame,
    );

    this.options.handleStackFrame?.(
      hook,
      tap,
      frame,
      options,
    );

    return frame;
  }

  traceHook(
    hook: AnyHook,
    options?: HookTracingOptions | null,
  ): void
  {
    options ??= {};

    hook.intercept({
      call: this.handleCall.bind(
        this,
        hook,
        options,
      ),
      loop: this.handleCall.bind(
        this,
        hook,
        options,
      ),
      name: this._getInterceptorName(),
      register: (tap) =>
      {
        this.handleTap(
          hook,
          tap,
          options,
        );

        return tap;
      },
    });
  }

  wrapTapAsync(
    hook: AnyHook,
    tap: FullTap,
    frame: TapFrame,
    superFn: HookCallback,
    options?: HookTracingOptions | null,
  ): void
  {
    options ??= {};

    if (options.includeTrigger)
    {
      tap.fn = (
        ...args: unknown[]
      ): unknown =>
      {
        this.pushTriggerFrame(
          hook,
          tap,
          frame,
          args,
          options,
        );

        return this._callAsync(
          frame,
          superFn,
          args,
        );
      };
    }
    else
    {
      tap.fn = (
        ...args: unknown[]
      ): unknown =>
      {
        return this._callAsync(
          frame,
          superFn,
          args,
        );
      };
    }
  }

  wrapTapPromise(
    hook: AnyHook,
    tap: FullTap,
    frame: TapFrame,
    superFn: HookCallback,
    options?: HookTracingOptions | null,
  ): void
  {
    options ??= {};

    if (options.includeTrigger)
    {
      tap.fn = async (
        ...args: unknown[]
      ): Promise<unknown> =>
      {
        this.pushTriggerFrame(
          hook,
          tap,
          frame,
          args,
          options,
        );

        return await this._callPromise(
          frame,
          superFn,
          args,
        );
      };
    }
    else
    {
      tap.fn = async (
        ...args: unknown[]
      ): Promise<unknown> =>
      {
        return await this._callPromise(
          frame,
          superFn,
          args,
        );
      };
    }
  }

  wrapTapSync(
    hook: AnyHook,
    tap: FullTap,
    frame: TapFrame,
    superFn: HookCallback,
    options?: HookTracingOptions | null,
  ): void
  {
    options ??= {};

    if (options.includeTrigger)
    {
      tap.fn = (
        ...args: unknown[]
      ): unknown =>
      {
        this.pushTriggerFrame(
          hook,
          tap,
          frame,
          args,
          options,
        );

        return this._callSync(
          frame,
          superFn,
          args,
        );
      };
    }
    else
    {
      tap.fn = (
        ...args: unknown[]
      ): unknown =>
      {
        return this._callSync(
          frame,
          superFn,
          args,
        );
      };
    }
  }
}
