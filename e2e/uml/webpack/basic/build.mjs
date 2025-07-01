import { writeFileSync } from "node:fs";
import { resolve as resolvePath } from "node:path";

import webpack from "webpack";

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

import {
  OUTPUT_DIR_PATH,
  SRC_DIR_PATH,
  TRACE_JSON_FILE_PATH,
} from "./constants.mjs";

/**
 * @import {
 *   type Configuration as WebpackConfiguration,
 *   type Stats as WebpackStats,
 * } from "webpack";
 *
 * @import { type TapableTracerPluginOptions } from "../../../../src/extensions/webpack";
 */

/**
 * @param {WebpackConfiguration} config
 * @returns {Promise<WebpackStats>}
 */
async function compileWebpack(
  config,
)
{
  return new Promise(
    (
      resolve,
      reject,
    ) =>
    {
      webpack(
        config,
        (
          err,
          stats,
        ) =>
        {
          if (err != null)
          {
            reject(err);
            return;
          }
          else if (stats == null)
          {
            reject(new Error("No webpack stats provided"));
            return;
          }

          if (stats.hasErrors())
          {
            const err = new Error("Webpack compilation failed");
            err.cause = stats;
            reject(err);
            return;
          }
          else
          {
            resolve(stats);
          }
        },
      );
    },
  );
}

/**
 * @param {TapableTracerPluginOptions} tracingOptions
 * @returns {WebpackConfiguration}
 */
function createWebpackConfig(
  tracingOptions,
)
{
  /**
   * @type {WebpackConfiguration}
   */
  return {
    bail: true,
    devtool: false,
    entry: {
      main: {
        import: [
          resolvePath(
            SRC_DIR_PATH,
            "main.js",
          ),
        ],
      },
    },
    mode: "production",
    output: {
      clean: true,
      path: OUTPUT_DIR_PATH,
    },
    plugins: [
      new TapableTracerPlugin(tracingOptions),
    ],
    target: "node",
  };
}

const config = createWebpackConfig({
  callback: (tracer) =>
  {
    const encodableFrames = dumpStackTrace(tracer.trace);

    writeFileSync(
      TRACE_JSON_FILE_PATH,
      JSON.stringify(
        encodableFrames,
        null,
        2,
      ),
    );
  },
});

const stats = await compileWebpack(config);
console.log(stats.toString({ colors: true }));
