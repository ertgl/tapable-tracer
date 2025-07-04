import {
  dirname,
  resolve as resolvePath,
} from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

export const PACKAGE_DIR_PATH = __dirname;

export const SRC_DIR_PATH = resolvePath(
  __dirname,
  "src",
);

export const OUTPUT_DIR_PATH = resolvePath(
  __dirname,
  ".next",
);

export const HOOK_TRACE_JSON_FILE_PATH = resolvePath(
  OUTPUT_DIR_PATH,
  "hook-trace.json",
);

export const PREVIEW_MARKDOWN_FILE_PATH = resolvePath(
  PACKAGE_DIR_PATH,
  "PREVIEW.md",
);
