import { Applicative, lift } from "src/applicative";
import { fmap } from "src/functor";
import { Kind, ToKind, Type } from "src/kind";
import { just } from "src/maybe";
import { Monad } from "src/monad";
import { pipe } from "src/pipe";

const sum = (a: number) => (b: number) => a + b;

const one = just(1);
const two = lift(one)(fmap((a: number) => (b: number) => a + b)(one));

const monad_add = <F extends Monad>(ma: F & Kind<number>) => (mb: F & Kind<number>): ToKind<F, number> => {
  const fa = ma as unknown as Monad<Type & Kind<number>>
  const fb = mb as unknown as Monad<Type & Kind<number>>

  return fa.bind((a) => fb.bind((b) => fb.pure(a + b)));
};

export const result1 = monad_add(one)(two);

const applicative_add = <F extends Applicative>(ma: F & Kind<number>) => (mb: F & Kind<number>): ToKind<F, number> => {
  return pipe(
    ma,
    fmap(sum),
    lift(mb)
  );
};

export const result2 = applicative_add(one)(two);
 