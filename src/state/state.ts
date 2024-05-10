
import { Kind, Type } from "../kind";
import { Monad } from "../monad";

declare const $state: unique symbol;
type $state = typeof $state;

export interface State<A = any> extends Type<$state>, Kind<A> {}
export class State<A = any> implements Monad<State<A>> {
  value: A;

  constructor(value: A) {
    this.value = value;
  }

  map: <B>(f: (a: A) => B) => State<B> = (f) => state(f(this.value));
  pure: (a: A) => State<A> = state;
  apply: <B>(f: State<(a: A) => B>) => State<B> = null!;
  bind: <B>(f: (a: A) => State<B>) => State<B> = (f) => f(this.value);
}

const state = <A>(value: A) => new State(value);

declare module "../kind" {
	interface KindMap<A, B, C, D> {
		[$state]: State<A>;
	}
}
