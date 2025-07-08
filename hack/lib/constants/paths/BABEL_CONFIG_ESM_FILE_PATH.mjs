import { resolve } from "node:path";

import { PROJECT_ROOT_DIRECTORY_PATH } from "./PROJECT_ROOT_DIRECTORY_PATH.mjs";

export const BABEL_CONFIG_ESM_FILE_PATH = resolve(
  PROJECT_ROOT_DIRECTORY_PATH,
  "babel.config.esm.cjs",
);
