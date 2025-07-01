import {
  dirname,
  resolve as resolvePath,
} from "node:path";
import { fileURLToPath } from "node:url";

/**
 * @import { type TransformOptions } from "@babel/core";
 * @import { type Config } from "jest";
 */

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const ROOT_DIR = __dirname;

/**
 * @satisfies {TransformOptions}
 */
const babelBaseConfig = {
  babelrcRoots: [
    ROOT_DIR,
  ],
  cwd: ROOT_DIR,
  root: ROOT_DIR,
  sourceType: "unambiguous",
};

/**
 * @satisfies {TransformOptions}
 */
const babelCJSConfig = {
  ...babelBaseConfig,
  configFile: resolvePath(
    ROOT_DIR,
    "babel.config.cjs.cjs",
  ),
};

/**
 * @satisfies {TransformOptions}
 */
const babelESMConfig = {
  ...babelBaseConfig,
  configFile: resolvePath(
    ROOT_DIR,
    "babel.config.esm.cjs",
  ),
};

/**
 * @type {Config}
 */
const JEST_CONFIG = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*",
    "!**/__fixtures__/**/*",
    "!**/__tests__/**/*",
  ],
  extensionsToTreatAsEsm: [
    ".ts",
    ".mts",
    ".tsx",
    ".jsx",
    ".mtsx",
    ".mjsx",
  ],
  moduleFileExtensions: [
    "ts",
    "js",
    "mts",
    "mjs",
    "cts",
    "cjs",
    "tsx",
    "jsx",
    "mtsx",
    "mjsx",
    "ctsx",
    "cjsx",
    "json",
    "node",
  ],
  testPathIgnorePatterns: [
    /[\\/]coverage[\\/]/iu.source,
    /[\\/]dist[\\/]/iu.source,
    /[\\/]node_modules[\\/]/iu.source,
  ],
  testRegex: [
    /\.test\.[cm]?[jt]s[x]?$/iu.source,
  ],
  transform: {
    [/\.[m]?[jt]s[x]?$/iu.source]: [
      "babel-jest",
      babelESMConfig,
    ],
    [/\.c[jt]s[x]?$/iu.source]: [
      "babel-jest",
      babelCJSConfig,
    ],
  },
};

export default JEST_CONFIG;
