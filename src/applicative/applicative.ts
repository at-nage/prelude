import { Functor } from "../functor";
import { A, Any, Kind, ToKind } from "../kind";
import { Lambda } from "../lambda";

export interface Applicative<F = Any> extends Functor<F> {
  // pure :: a -> f a
  pure: (a: A<F>) => ToKind<F, A<F>>;

  // (<*>) :: f (a -> b) -> f b
  apply: <B>(f: ToKind<F, (a: A<F>) => B>) => ToKind<F, B>;
}

// f (a -> b) -> f a -> f b
export const apply = <F extends Applicative, L extends Lambda>(f: F & Kind<L> & ToKind<F, L>) => <FA extends Applicative<F>>(fa: FA): ToKind<F> => {
  return fa.apply(f);
};

// f a -> f (a -> b) ->  f b
export const lift = <FA extends Applicative, A>(fa: FA & Kind<A>) => <F extends Applicative, B>(f: F & Kind<Lambda<A, B>>): ToKind<F, B> => {
  return fa.apply(f)(fa);
};
