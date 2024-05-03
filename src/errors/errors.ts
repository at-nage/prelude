import { UnreachableError } from "./exceptions";

export const error = (message?: string) => {
  return new Error(message);
};

export const unreachable = (message?: string) => {
  throw new UnreachableError(message);
};
