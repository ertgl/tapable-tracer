/**
 * @import { type BuildTargetFileExtension } from "./BuildTargetFileExtension.mjs";
 * @import { type BuildTargetFormat } from "./BuildTargetFormat.mjs";
 */

/**
 * @constant
 * @satisfies {Record<BuildTargetFormat, BuildTargetFileExtension>}
 */
export const BUILD_TARGET_FORMAT_TO_FILE_EXTENSION_MAPPING = {
  cjs: ".cjs",
  esm: ".mjs",
};
