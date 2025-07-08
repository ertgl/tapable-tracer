import { dirname } from "node:path";

import { HACK_LIB_DIRECTORY_PATH } from "./HACK_LIB_DIRECTORY_PATH.mjs";

export const HACK_DIRECTORY_PATH = dirname(HACK_LIB_DIRECTORY_PATH);
