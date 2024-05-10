// kind

declare const $any: unique symbol;
declare const $type: unique symbol;

type $any = typeof $any;
type $type = typeof $type;

interface Type<T extends TYPES = TYPES> {
	[$type]: T;
}

declare const $a: unique symbol;
declare const $b: unique symbol;
declare const $c: unique symbol;
declare const $d: unique symbol;

interface Kind<A = never, B = never, C = never, D = never> {
	[$a]: A;
	[$b]: B;
	[$c]: C;
	[$d]: D;
}

type Any<A = any, B = any, C = any, D = any> = Type<$any> & Kind<A, B, C, D>;

type A<F> = F extends Kind<infer A, any, any, any> ? A : never;
type B<F> = F extends Kind<any, infer B, any, any> ? B : never;
type C<F> = F extends Kind<any, any, infer C, any> ? C : never;
type D<F> = F extends Kind<any, any, any, infer D> ? D : never;

interface KindMap<A, B, C, D> {
	[$any]: any;
	[$type]: Kind<A, B, C, D>;
}

type TYPES = keyof KindMap<never, never, never, never>;

type ToKind<T, A = never, B = never, C = never, D = never> = T extends { [$type]: TYPES } ? KindMap<A, B, C, D>[T[$type]] : never;

type Lambda<A = any, Z = any> = (arg: A) => Z;

// functor

interface Functor<F = Any> extends Type {
	// map (a -> b) -> f b
	map: <B>(f: (a: A<F>) => B) => ToKind<F, B>;
}

// fmap (a -> b) -> f a -> f b
export const fmap = <A, B>(f: (a: A) => B) => <F extends Functor>(fa: F & Kind<A>): ToKind<F, B> => {
  return fa.map(f);
};

// applicative

interface Applicative<F = Any> extends Functor<F> {
	// pure :: a -> f a
	pure: (a: A<F>) => ToKind<F, A<F>>;

	// (<*>) :: f (a -> b) -> f b
	apply: <B>(f: ToKind<F, (a: A<F>) => B>) => ToKind<F, B>;
}

// (<*>) :: f (a -> b) -> f a -> f b
export const apply = <F extends Applicative, L extends Lambda>(f: F & Kind<L> & ToKind<F, L>) => <FA extends Applicative<F>>(fa: FA): ToKind<F> => {
  return fa.apply(f);
};

// f a -> f (a -> b) ->  f b
export const lift = <FA extends Applicative, A>(fa: FA & Kind<A>) => <F extends Applicative, B>(f: F & Kind<Lambda<A, B>>): ToKind<F, B> => {
  return fa.apply(f)(fa);
};

// monad

interface Monad<F = Any> extends Applicative<F> {
	// (>>=) :: m a -> (a -> m b) -> m b
	bind: <B>(f: (a: A<F>) => ToKind<F, B>) => ToKind<F, B>;
}

export const bind = <F extends Monad, A>(fa: F & Kind<A>) => <B>(f: (a: A) => ToKind<F, B>): Monad & ToKind<F, B> => {
  return fa.bind<A>(f);
};

// maybe

declare const $maybe: unique symbol;
type $maybe = typeof $maybe;

interface Maybe<A = any> extends Type<$maybe>, Kind<A> {}
abstract class Maybe<A = any> implements Monad<Maybe<A>> {
	abstract map: <B>(f: (a: A) => B) => Maybe<B>;
	abstract pure: (a: A) => Maybe<A>;
	abstract apply: <B>(f: Maybe<(a: A) => B>) => Maybe<B>;
	abstract bind: <B>(f: (a: A) => Maybe<B>) => Maybe<B>;
}

	interface KindMap<A, B, C, D> {
		[$maybe]: Maybe<A>;
	}

// nothing

interface Nothing extends Type<$maybe>, Kind<any> {}
class Nothing extends Maybe {
	private static instance = new Nothing();

	constructor() {
		super();
		return Nothing.instance;
	}

	override map: <B>(f: (a: any) => B) => Maybe<B> = nothing;
  override pure: (a: any) => Maybe<any> = just;
	override apply: <B>(f: Maybe<(a: any) => B>) => Maybe<B> = nothing;
	override bind: <B>(f: (a: any) => Maybe<B>) => Maybe<B> = nothing;
}

// just

interface Just<A> extends Type<$maybe>, Kind<A> {}
class Just<A> extends Maybe<A> {
	value: A;

	constructor(value: A) {
		super();
		this.value = value;
	}

	override map: <B>(f: (a: A) => B) => Maybe<B> = (f) => just(f(this.value));
  override pure: (a: A) => Maybe<A> = just;
	override apply: <B>(f: Maybe<(a: A) => B>) => Maybe<B> = match(this.map, nothing);  
	override bind: <B>(f: (a: A) => Maybe<B>) => Maybe<B> = (f) => f(this.value);
}

const nothing = (): Maybe => new Nothing();
const just = <A>(a: A): Maybe<A> => new Just(a);

const is_nothing = <A>(maybe: Maybe<A> | Nothing): maybe is Nothing => maybe instanceof Nothing;
const is_just = <A>(maybe: Maybe<A> | Just<A>): maybe is Just<A> => maybe instanceof Just;

const match = <A, Z = void>(just: (a: A) => Z, nothing: () => Z) => (maybe: Maybe<A>): Z => {
  if (is_just(maybe)) {
    return just(maybe.value);
  }

  if (is_nothing(maybe)) {
    return nothing();
  }

  throw new Error();
};

// tests

const sum = (a: number) => (b: number) => a + b;

const one = just(1);
const two = lift(one)(fmap((a: number) => (b: number) => a + b)(one));

const monad_add = <F extends Monad, A extends number>(ma: F & Kind<A>) => (mb: F & Kind<A>): ToKind<F, A> => {
  return ma.bind((a) => mb.bind((b) => mb.pure(a + b)));
};

export const result1 = monad_add(one)(two);

const applicative_add = <F extends Applicative, A extends number>(ma: F & Kind<A>) => (mb: F & Kind<A>): ToKind<F, A> => {
  return lift(mb)(fmap(sum)(ma))
};

export const result2 = applicative_add(one)(two);
