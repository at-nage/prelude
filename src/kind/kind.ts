declare const $any: unique symbol;
declare const $type: unique symbol;

type $any = typeof $any;
type $type = typeof $type;

export interface Type<T extends TYPES = TYPES> {
  [$type]: T;
}

declare const $a: unique symbol;
declare const $b: unique symbol;
declare const $c: unique symbol;
declare const $d: unique symbol;

export interface Kind<A = never, B = never, C = never, D = never> {
  [$a]: A;
  [$b]: B;
  [$c]: C;
  [$d]: D;
}

export type Any<A = any, B = any, C = any, D = any> = Type & Kind<A, B, C, D>;

export type A<F> = F extends Kind<infer A, any, any, any> ? A : never;
export type B<F> = F extends Kind<any, infer B, any, any> ? B : never;
export type C<F> = F extends Kind<any, any, infer C, never> ? C : never;
export type D<F> = F extends Kind<any, any, any, infer D> ? D : never;

export interface KindMap<A, B, C, D> {
  [$any]: any;
  [$type]: Kind<A, B, C, D>;
}

type TYPES = keyof KindMap<never, never, never, never>;

export type ToKind<T, W = A<T>, X = B<T>, Y = C<T>, Z = D<T>> = T extends { [$type]: TYPES }
  ? KindMap<W, X, Y, Z>[T[$type]]
  : never;
