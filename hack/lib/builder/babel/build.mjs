import {
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { transformSync } from "@babel/core";

import { generateDistFilePath } from "../../build/dist/generateDistFilePath.mjs";
import { iterateSourceFileDirents } from "../../build/source/iterateSourceFileDirents.mjs";
import { BUILD_TARGET_FORMAT_TO_FILE_EXTENSION_MAPPING } from "../../build/target/BUILD_TARGET_FORMAT_TO_FILE_EXTENSION_MAPPING.mjs";
import { getDirentFullPath } from "../../fs/dirent/getDirentFullPath.mjs";

import { enableRuntimeFreeFileReporterPlugin } from "./plugins/report-runtime-free-files/enableRuntimeFreeFileReporterPlugin.mjs";
import { isBabelFileResultRuntimeFree } from "./plugins/report-runtime-free-files/isBabelFileResultRuntimeFree.mjs";

/**
 * @import { type TransformOptions } from "@babel/core";
 *
 * @import { type BuilderOptions } from "./BuilderOptions.mjs";
 */

const __filename = fileURLToPath(import.meta.url);

const require = createRequire(__filename);

/**
 * @param {BuilderOptions} options
 */
export function build(options)
{
  const {
    exclude: excludedSourceFileGlobPatterns = [],
    format,
    paths: {
      configFile: configFilePath,
      dist: distDirectoryPath,
      src: srcDirectoryPath,
    },
  } = options;

  const outputFileExtension = BUILD_TARGET_FORMAT_TO_FILE_EXTENSION_MAPPING[format];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (outputFileExtension == null)
  {
    throw new TypeError(`Missing output file extension for format: ${format}`);
  }

  /**
   * @type {TransformOptions}
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const baseTransformOptions = require(configFilePath);

  if (typeof baseTransformOptions === "function")
  {
    throw new TypeError("The custom Babel builder does not support `ConfigFunction`.");
  }

  const sourceFileDirentIterator = iterateSourceFileDirents(
    srcDirectoryPath,
    {
      exclude: excludedSourceFileGlobPatterns,
    },
  );

  let compiledFilesCount = 0;
  let runtimeFreeFilesCount = 0;

  for (const sourceFileDirent of sourceFileDirentIterator)
  {
    const sourceFilePath = getDirentFullPath(sourceFileDirent);

    const outputFilePath = generateDistFilePath(
      srcDirectoryPath,
      distDirectoryPath,
      sourceFilePath,
      outputFileExtension,
    );

    const sourceCode = readFileSync(
      sourceFilePath,
      "utf8",
    );

    /**
     * @satisfies {TransformOptions}
     */
    const transformOptions = {
      ...baseTransformOptions,
      babelrc: false,
      browserslistConfigFile: false,
      configFile: false,
      filename: sourceFilePath,
    };

    enableRuntimeFreeFileReporterPlugin(transformOptions);

    const babelFileResult = transformSync(
      sourceCode,
      transformOptions,
    );

    if (babelFileResult?.code == null)
    {
      continue;
    }

    compiledFilesCount++;

    if (isBabelFileResultRuntimeFree(babelFileResult))
    {
      runtimeFreeFilesCount++;
      continue;
    }

    mkdirSync(
      dirname(outputFilePath),
      {
        recursive: true,
      },
    );

    writeFileSync(
      outputFilePath,
      babelFileResult.code,
      "utf8",
    );
  }

  console.log(`Successfully compiled ${String(compiledFilesCount)} files for ${format} format with Babel (${String(runtimeFreeFilesCount)} excluded from distribution)`);
}
