import { resolve } from "node:path";

import { DIST_DIRECTORY_PATH } from "./DIST_DIRECTORY_PATH.mjs";

export const DIST_ESM_DIRECTORY_PATH = resolve(
  DIST_DIRECTORY_PATH,
  "esm",
);
