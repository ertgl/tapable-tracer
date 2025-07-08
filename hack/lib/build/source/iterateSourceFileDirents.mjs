import { globSync } from "node:fs";

/**
 * @import { type Dirent } from "node:fs";
 *
 * @import { type SourceFileDirentIteratorOptions } from "./SourceFileDirentIteratorOptions.mjs";
 */

/**
 * @param {string} srcDirectoryPath
 * @param {SourceFileDirentIteratorOptions | null} [options]
 * @yields {Dirent}
 * @returns {Iterable<Dirent>}
 */
export function* iterateSourceFileDirents(
  srcDirectoryPath,
  options,
)
{
  options ??= {};

  yield* globSync(
    "**/*.{cj,ct,j,mj,mt,t}s",
    {
      cwd: srcDirectoryPath,
      exclude: options.exclude ?? undefined,
      withFileTypes: true,
    },
  );
}
