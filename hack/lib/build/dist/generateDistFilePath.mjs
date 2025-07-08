import {
  parse,
  relative,
  resolve,
} from "node:path";

/**
 * @param {string} srcDirectoryPath
 * @param {string} distDirectoryPath
 * @param {string} sourceFilePath
 * @param {string} outputFileExtension
 * @returns {string}
 */
export function generateDistFilePath(
  srcDirectoryPath,
  distDirectoryPath,
  sourceFilePath,
  outputFileExtension,
)
{
  const srcRelativeFilePath = relative(
    srcDirectoryPath,
    sourceFilePath,
  );

  const srcRelativeFileParsedPath = parse(srcRelativeFilePath);

  return resolve(
    distDirectoryPath,
    srcRelativeFileParsedPath.dir,
    srcRelativeFileParsedPath.name + outputFileExtension,
  );
}
