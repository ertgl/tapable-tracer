/**
 * @import {
 *   type NodePath,
 *   type PluginPass,
 * } from "@babel/core";
 * @import { type Program } from "@babel/types";
 *
 * @import { type Options as RuntimeFreeFileReporterOptions } from "babel-plugin-report-runtime-free-files";
 */

/**
 * @returns {RuntimeFreeFileReporterOptions}
 */
export function createRuntimeFreeFileReporterOptions()
{
  /**
   * @param {NodePath<Program>} programPath
   * @param {PluginPass} programState
   * @param {boolean} isRuntimeFree
   */
  function callback(
    programPath,
    programState,
    isRuntimeFree,
  )
  {
    // @ts-expect-error - The property `isRuntimeFree` on `BabelFile.metadata` is not typed.
    programState.file.metadata.isRuntimeFree = isRuntimeFree;
  }

  return {
    callback,
  };
}
