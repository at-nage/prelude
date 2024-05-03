import { Lambda, is_lambda } from "../lambda";

export type Lazy<A> = Lambda<void, A> | A;

export const lazy = <A>(value: Lazy<A>) => {
  if(is_lambda(value)) return value();
  return value;
}
