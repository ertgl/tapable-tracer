import { writeFileSync } from "node:fs";

import { SyncHook } from "tapable";

import {
  createTracer,
  dumpStackTrace,
  traceHook,
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Available after build.
} from "tapable-tracer";
import {
  generateMermaidUML,
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Available after build.
} from "tapable-tracer/extensions/mermaid";

import { PREVIEW_MARKDOWN_FILE_PATH } from "./constants.mjs";

const tracer = createTracer();

const hook1Name = "hook1";
const hook1 = new SyncHook([], hook1Name);
traceHook(
  tracer,
  hook1,
);

const hook2Name = "hook2";
const hook2 = new SyncHook([], hook2Name);
traceHook(
  tracer,
  hook2,
);

const hook3Name = "hook3";
const hook3 = new SyncHook([], hook3Name);
traceHook(
  tracer,
  hook3,
);

const hook4Name = "hook4";
const hook4 = new SyncHook([], hook4Name);
traceHook(
  tracer,
  hook4,
);

hook1.tap(
  hook2Name,
  hook2.call.bind(hook2),
);

hook2.tap(
  hook3Name,
  hook3.call.bind(hook3),
);

hook3.tap(
  hook4Name,
  hook4.call.bind(hook4),
);

hook1.call();

const frames = dumpStackTrace(tracer.trace);

console.log(frames);

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
