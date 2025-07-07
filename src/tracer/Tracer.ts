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
import { createStackTrace } from "../stack-trace/createStackTrace";
import { dumpStackTrace } from "../stack-trace/dumpStackTrace";
import { pushStackFrame } from "../stack-trace/pushStackFrame";
import type { StackTrace } from "../stack-trace/StackTrace";
import { labelTap } from "../tap/label/labelTap";
import type { TapLabel } from "../tap/label/TapLabel";

import { createTracerHookRegistry } from "./hook/registry/createTracerHookRegistry";
import type { TracerHookRegistry } from "./hook/registry/TracerHookRegistry";
import type { HookTracingOptions } from "./options/HookTracingOptions";
import type { TracerOptions } from "./options/TracerOptions";
import type { CallSite } from "./stack/CallSite";

export class Tracer
{
  readonly hookLabels: WeakMap<AnyHook, HookLabel>;

  hookLabelSequence: number;

  readonly options: TracerOptions;

  readonly stack: CallSite[];

  readonly tapLabels: WeakMap<FullTap, HookLabel>;

  tapLabelSequence: number;

  readonly trace: StackTrace;

  readonly tracerHooks: TracerHookRegistry;

  constructor(
    options?: null | TracerOptions,
  )
  {
    this.options = options ?? {};

    this.tracerHooks = createTracerHookRegistry();

    this.hookLabelSequence = -1;
    this.hookLabels = new WeakMap();

    this.tapLabelSequence = -1;
    this.tapLabels = new WeakMap();

    this.stack = [];
    this.trace = createStackTrace();
  }

  _callAsync(
    callSite: CallSite,
    options: HookTracingOptions,
    args: unknown[],
  ): unknown
  {
    this.stack.push(callSite);

    const callback = (
      ...callbackArgs: unknown[]
    ): void =>
    {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-function-type
      (args[args.length - 1] as Function)(...callbackArgs);

      this.stack.pop();
    };

    this.tracerHooks.preCall.call({
      fn: callSite.fn,
      hook: callSite.hook,
      options,
      tap: callSite.tap,
    });

    const result: unknown = callSite.fn(
      ...args.slice(0, args.length - 1),
      callback,
    );

    this.tracerHooks.postCall.call({
      fn: callSite.fn,
      hook: callSite.hook,
      options,
      tap: callSite.tap,
    });

    return result;
  }

  async _callPromise(
    callSite: CallSite,
    options: HookTracingOptions,
    args: unknown[],
  ): Promise<unknown>
  {
    this.stack.push(callSite);

    const maybePromise: unknown = callSite.fn(...args);

    this.tracerHooks.preCall.call({
      fn: callSite.fn,
      hook: callSite.hook,
      options,
      tap: callSite.tap,
    });

    const result: unknown = (
      maybePromise instanceof Promise
        ? await maybePromise
        : maybePromise
    );

    this.tracerHooks.postCall.call({
      fn: callSite.fn,
      hook: callSite.hook,
      options,
      tap: callSite.tap,
    });

    this.stack.pop();

    return result;
  }

  _callSync(
    callSite: CallSite,
    options: HookTracingOptions,
    args: unknown[],
  ): unknown
  {
    this.stack.push(callSite);

    this.tracerHooks.preCall.call({
      fn: callSite.fn,
      hook: callSite.hook,
      options,
      tap: callSite.tap,
    });

    const result: unknown = callSite.fn(...args);

    this.tracerHooks.postCall.call({
      fn: callSite.fn,
      hook: callSite.hook,
      options,
      tap: callSite.tap,
    });

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
    let label = this.hookLabels.get(hook);

    if (label == null)
    {
      this.hookLabelSequence++;

      label = (
        this.options.labelHook
        ?? labelHook
      )(
        hook,
        this.hookLabelSequence,
        options,
      );

      this.hookLabels.set(
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
    let label = this.tapLabels.get(tap);

    if (label == null)
    {
      this.tapLabelSequence++;

      label = (
        this.options.labelTap
        ?? labelTap
      )(
        hook,
        tap,
        this.tapLabelSequence,
        options,
      );

      this.tapLabels.set(
        tap,
        label,
      );
    }

    return label;
  }

  _getPreviousFrameLabel(
    options: HookTracingOptions,
  ): null | StackFrameLabel
  {
    const callSite = this.stack[this.stack.length - 1] as CallSite | undefined;

    if (callSite == null)
    {
      return null;
    }

    let label: null | StackFrameLabel = null;

    if (options.includeTrigger)
    {
      label = this._getOrCreateLabelForTap(
        callSite.hook,
        callSite.tap,
        options,
      );
    }
    else
    {
      label = this._getOrCreateLabelForHook(
        callSite.hook,
        options,
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

    const callSite: CallSite = {
      fn: tap.fn as HookCallback,
      hook,
      tap,
    };

    this.pushTapFrame(
      callSite,
      options,
    );

    if (tap.type === "async")
    {
      this.wrapTapAsync(
        callSite,
        options,
      );
    }
    else if (tap.type === "promise")
    {
      this.wrapTapPromise(
        callSite,
        options,
      );
    }
    else
    {
      this.wrapTapSync(
        callSite,
        options,
      );
    }
  }

  pushCallFrame(
    hook: AnyHook,
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

    this.tracerHooks.handleStackFrame.call({
      frame,
      hook,
      options,
      tap: null,
    });

    return frame;
  }

  pushTapFrame(
    callSite: CallSite,
    options: HookTracingOptions,
  ): void
  {
    const frame = createTapFrame({
      hook: this._getOrCreateLabelForHook(
        callSite.hook,
        options,
      ),
      tap: this._getOrCreateLabelForTap(
        callSite.hook,
        callSite.tap,
        options,
      ),
      wrapped: callSite.fn,
    });

    pushStackFrame(
      this.trace,
      frame,
    );

    this.tracerHooks.handleStackFrame.call({
      frame,
      hook: callSite.hook,
      options,
      tap: callSite.tap,
    });
  }

  pushTriggerFrame(
    callSite: CallSite,
    args: unknown[],
    options: HookTracingOptions,
  ): void
  {
    const frame = createTriggerFrame({
      args,
      callee: this._getOrCreateLabelForTap(
        callSite.hook,
        callSite.tap,
        options,
      ),
      caller: this._getOrCreateLabelForHook(
        callSite.hook,
        options,
      ),
    });

    pushStackFrame(
      this.trace,
      frame,
    );

    this.tracerHooks.handleStackFrame.call({
      frame,
      hook: callSite.hook,
      options,
      tap: callSite.tap,
    });
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
    callSite: CallSite,
    options?: HookTracingOptions | null,
  ): void
  {
    options ??= {};

    callSite.tap.fn = (
      ...args: unknown[]
    ): unknown =>
    {
      if (options.includeTrigger)
      {
        this.pushTriggerFrame(
          callSite,
          args,
          options,
        );
      }

      return this._callAsync(
        callSite,
        options,
        args,
      );
    };
  }

  wrapTapPromise(
    callSite: CallSite,
    options?: HookTracingOptions | null,
  ): void
  {
    options ??= {};

    callSite.tap.fn = async (
      ...args: unknown[]
    ): Promise<unknown> =>
    {
      if (options.includeTrigger)
      {
        this.pushTriggerFrame(
          callSite,
          args,
          options,
        );
      }

      return await this._callPromise(
        callSite,
        options,
        args,
      );
    };
  }

  wrapTapSync(
    callSite: CallSite,
    options?: HookTracingOptions | null,
  ): void
  {
    options ??= {};

    callSite.tap.fn = (
      ...args: unknown[]
    ): unknown =>
    {
      if (options.includeTrigger)
      {
        this.pushTriggerFrame(
          callSite,
          args,
          options,
        );
      }

      return this._callSync(
        callSite,
        options,
        args,
      );
    };
  }
}
