import type {
  AsyncParallelBailHook,
  AsyncParallelHook,
  AsyncSeriesBailHook,
  AsyncSeriesHook,
  AsyncSeriesLoopHook,
  AsyncSeriesWaterfallHook,
  SyncBailHook,
  SyncHook,
  SyncLoopHook,
  SyncWaterfallHook,
} from "tapable";

export type AnyHook = (
  | AsyncParallelBailHook<any, any>
  | AsyncParallelHook<any>
  | AsyncSeriesBailHook<any, any>
  | AsyncSeriesHook<any>
  | AsyncSeriesLoopHook<any>
  | AsyncSeriesWaterfallHook<any>
  | SyncBailHook<any, any>
  | SyncHook<any, any>
  | SyncLoopHook<any>
  | SyncWaterfallHook<any>
);
