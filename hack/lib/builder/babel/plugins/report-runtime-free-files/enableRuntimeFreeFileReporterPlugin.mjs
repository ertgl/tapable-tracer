import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { createRuntimeFreeFileReporterOptions } from "./createRuntimeFreeFileReporterOptions.mjs";

/**
 * @import { type TransformOptions } from "@babel/core";
 */

const __filename = fileURLToPath(import.meta.url);

const require = createRequire(__filename);

/**
 * @param {TransformOptions} transformOptions
 * @returns {void}
 */
export function enableRuntimeFreeFileReporterPlugin(transformOptions)
{
  transformOptions.plugins ??= [];

  transformOptions.plugins.push(
    [
      require.resolve("babel-plugin-report-runtime-free-files"),
      createRuntimeFreeFileReporterOptions(),
    ],
  );
}
