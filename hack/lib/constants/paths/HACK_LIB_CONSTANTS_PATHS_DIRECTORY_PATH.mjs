import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

export const HACK_LIB_CONSTANTS_PATHS_DIRECTORY_PATH = __dirname;
