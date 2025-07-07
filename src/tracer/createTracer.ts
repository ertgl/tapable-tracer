import type { TracerOptions } from "./options/TracerOptions";
import { Tracer } from "./Tracer";

export function createTracer(
  options?: null | TracerOptions,
): Tracer
{
  return new Tracer(options);
}
