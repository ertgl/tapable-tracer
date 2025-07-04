import { writeFileSync } from "node:fs";

import type { NextConfig } from "next";
import type { WebpackConfigContext } from "next/dist/server/config-shared";
import type { Configuration as WebpackConfiguration } from "webpack";

import {
  dumpStackTrace,
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Available after build.
} from "tapable-tracer";
import {
  TapableTracerPlugin,
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Available after build.
} from "tapable-tracer/extensions/webpack";

import { HOOK_TRACE_JSON_FILE_PATH } from "./constants.mjs";

const nextConfig: NextConfig = {
  webpack: (
    webpackConfig: WebpackConfiguration,
    webpackContext: WebpackConfigContext,
  ) =>
  {
    webpackConfig.plugins ??= [];

    webpackConfig.plugins.push(
      new TapableTracerPlugin({
        callback: (tracer) =>
        {
          const encodableFrames = dumpStackTrace(tracer.trace);

          writeFileSync(
            HOOK_TRACE_JSON_FILE_PATH,
            JSON.stringify(
              encodableFrames,
              null,
              2,
            ),
          );
        },
      }),
    );

    return webpackConfig;
  },
};

export default nextConfig;
