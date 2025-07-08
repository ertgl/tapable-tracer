import { resolve } from "node:path";

import { PROJECT_ROOT_DIRECTORY_PATH } from "./PROJECT_ROOT_DIRECTORY_PATH.mjs";

export const DIST_DIRECTORY_PATH = resolve(
  PROJECT_ROOT_DIRECTORY_PATH,
  "dist",
);
