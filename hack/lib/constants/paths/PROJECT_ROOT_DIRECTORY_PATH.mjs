import { dirname } from "node:path";

import { HACK_DIRECTORY_PATH } from "./HACK_DIRECTORY_PATH.mjs";

export const PROJECT_ROOT_DIRECTORY_PATH = dirname(HACK_DIRECTORY_PATH);
