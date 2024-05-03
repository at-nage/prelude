import { Applicative } from "../applicative";
import { A, Any, Kind, ToKind } from "../kind";

export interface Monad<F extends Any = Any> extends Applicative<F> {
  // (>>=) :: m a -> (a -> m b) -> m b
  bind: <B>(f: (a: A<F>) => ToKind<F, B>) => ToKind<F, B>;
}

export const bind = <F extends Monad, A>(fa: F & Kind<A>) => <B>(f: (a: A) => ToKind<F, B>): Monad & ToKind<F, B> => {
  return fa.bind<A>(f);
};
