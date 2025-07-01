import type { StackTrace } from "./StackTrace";

export function createStackTrace(): StackTrace
{
  return {
    frames: [],
  };
}
