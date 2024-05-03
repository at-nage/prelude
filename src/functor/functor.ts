import { A, Any, Kind, ToKind, Type } from "../kind";

export interface Functor<F = Any> extends Type {
  // map (a -> b) -> f b
  map: <B>(f: (a: A<F>) => B) => ToKind<F, B>;
}

// fmap (a -> b) -> f a -> f b
export const fmap = <A, B>(f: (a: A) => B) => <F extends Functor>(fa: F & Kind<A>): ToKind<F, B> => {
  return fa.map(f);
};
