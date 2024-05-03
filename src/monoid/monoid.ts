import { Semigroup } from "../semigroup";

export interface Monoid<F = any> extends Semigroup<F> {
  empty: F
}
