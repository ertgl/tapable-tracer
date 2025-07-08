import { build } from "../lib/builder/babel/build.mjs";
import { EXCLUDED_SOURCE_FILE_PATH_GLOB_PATTERNS } from "../lib/constants/glob-patterns/EXCLUDED_SOURCE_FILE_PATH_GLOB_PATTERNS.mjs";
import { BABEL_CONFIG_CJS_FILE_PATH } from "../lib/constants/paths/BABEL_CONFIG_CJS_FILE_PATH.mjs";
import { DIST_CJS_DIRECTORY_PATH } from "../lib/constants/paths/DIST_CJS_DIRECTORY_PATH.mjs";
import { SRC_DIRECTORY_PATH } from "../lib/constants/paths/SRC_DIRECTORY_PATH.mjs";

build({
  exclude: EXCLUDED_SOURCE_FILE_PATH_GLOB_PATTERNS,
  format: "cjs",
  paths: {
    configFile: BABEL_CONFIG_CJS_FILE_PATH,
    dist: DIST_CJS_DIRECTORY_PATH,
    src: SRC_DIRECTORY_PATH,
  },
});
