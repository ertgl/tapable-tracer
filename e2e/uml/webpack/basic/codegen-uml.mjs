import {
  readFileSync,
  writeFileSync,
} from "node:fs";

import {
  generateMermaidUML,
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Available after build.
} from "tapable-tracer/extensions/mermaid";

import {
  PREVIEW_MARKDOWN_FILE_PATH,
  TRACE_JSON_FILE_PATH,
} from "./constants.mjs";

/**
 * @import { type EncodableStackFrame } from "../../../../src";
 */

/**
 * @type {EncodableStackFrame[]}
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const frames = JSON.parse(
  readFileSync(
    TRACE_JSON_FILE_PATH,
    "utf8",
  ),
);

const uml = generateMermaidUML(frames);

const markdown = `\`\`\`mermaid\n${uml}\`\`\``;

writeFileSync(
  PREVIEW_MARKDOWN_FILE_PATH,
  markdown,
  {
    encoding: "utf8",
    flush: true,
  },
);
