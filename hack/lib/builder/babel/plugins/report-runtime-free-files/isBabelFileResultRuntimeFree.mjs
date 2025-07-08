/**
 * @import { type BabelFileResult } from "@babel/core";
 */

/**
 * @param {BabelFileResult} babelFileResult
 * @returns {boolean}
 */
export function isBabelFileResultRuntimeFree(babelFileResult)
{
  // @ts-expect-error - The property `isRuntimeFree` on `BabelFile.metadata` is not typed.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return babelFileResult.metadata.isRuntimeFree;
}
