import { Lazy, lazy } from "src/lazy";
import { B, C, D, Kind } from "../kind";

export interface Semigroup<F = any> {
	// a -> a
	binary: <A extends Semigroup>(a: F & Kind<A, B<F>, C<F>, D<F>>) => F;
}

// (<>) :: a -> a -> a
export const binary = <F extends Semigroup, A extends Semigroup>(fa: Lazy<F & Kind<A>>) => (fb: Lazy<F & Kind<A>>): F => {
  return lazy(fa).binary(lazy(fb));
};
