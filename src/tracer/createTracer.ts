import { Tracer } from "./Tracer";
import type { TracerOptions } from "./TracerOptions";

export function createTracer(
  options?: null | TracerOptions,
): Tracer
{
  return new Tracer(options);
}
