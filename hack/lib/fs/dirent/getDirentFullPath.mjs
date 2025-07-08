import { resolve } from "node:path";

/**
 * @import { type Dirent } from "node:fs";
 */

/**
 * @param {Dirent} dirent
 * @returns {string}
 */
export function getDirentFullPath(dirent)
{
  return resolve(
    dirent.parentPath,
    dirent.name,
  );
}
