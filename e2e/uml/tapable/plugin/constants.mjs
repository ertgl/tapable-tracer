import {
  dirname,
  resolve as resolvePath,
} from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

export const PACKAGE_DIR_PATH = __dirname;

export const PREVIEW_MARKDOWN_FILE_PATH = resolvePath(
  PACKAGE_DIR_PATH,
  "PREVIEW.md",
);
