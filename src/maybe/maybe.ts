import { unreachable } from "../errors";
import { Kind, Type } from "../kind";
import { Lambda } from "../lambda";
import { Lazy, lazy } from "../lazy";
import { List } from "../list";
import { Monad } from "../monad";
import { Monoid } from "../monoid";
import { Semigroup, binary } from "../semigroup";

declare const $maybe: unique symbol;
type $maybe = typeof $maybe;

export interface Maybe<A = any> extends Type<$maybe>, Kind<A> {}
export abstract class Maybe<A = any> implements Monad<Maybe<A>>, Monoid<Maybe<A>> {
	abstract map: <B>(f: (a: A) => B) => Maybe<B>;
	abstract pure: (a: A) => Maybe<A>;
	abstract apply: <B>(f: Maybe<(a: A) => B>) => Maybe<B>;
	abstract bind: <B>(f: (a: A) => Maybe<B>) => Maybe<B>;
	abstract binary: <B extends Semigroup>(fb: Maybe<A> & Kind<B>) => Maybe<A>;
	abstract empty: Maybe<A>;

	static map = <A, B>(f: (a: A) => Maybe<B>) => (list: List<A>) => {
		let node = list;
		let result = List.empty<B>();
		
		while (List.is_node(node)) {
			result = maybe (result) ((b: B) => List.node(b, result)) (f(List.head(node)));
			node = List.tail(node);
		}

		return result;
	}
}

declare module "../kind" {
	interface KindMap<A, B, C, D> {
		[$maybe]: Maybe<A>;
	}
}

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
	override binary: (fb: Maybe<any>) => Maybe<any> = nothing;
	override empty: Maybe<any> = nothing();
}

class Just<A> extends Maybe<A> {
	value: A;

	constructor(value: A) {
		super();
		this.value = value;
	}

	self = (): any => this.value;

	override map: <B>(f: (a: A) => B) => Maybe<B> = (f) => just(f(this.value));
	override pure: (a: A) => Maybe<A> = just;
	override apply: <B>(f: Maybe<(a: A) => B>) => Maybe<B> = maybe (nothing) (this.map);
	override bind: <B>(f: (a: A) => Maybe<B>) => Maybe<B> = (f) => f(this.value);
	override binary: <B extends Semigroup>(fb: Maybe<A> & Kind<B>) => Maybe<A> = maybe (nothing) (Lambda.compose(binary(this.self), just));
	override empty: Maybe<any> = nothing();
}

export const nothing = (): Maybe => new Nothing();
export const just = <A>(a: A): Maybe<A> => new Just(a);

export const is_nothing = <A>(maybe: Maybe<A>): maybe is Nothing => maybe instanceof Nothing;
export const is_just = <A>(maybe: Maybe<A>): maybe is Just<A> => maybe instanceof Just;

export const maybe = <B>(on_nothing: Lazy<B>) => <A>(on_just: (a: A) => B) => (maybe: Maybe<A>) => {
	switch (true) {
		case is_just(maybe):
			return on_just(maybe.value);
		case is_nothing(maybe):
			return lazy(on_nothing);
		default:
			throw unreachable();
	}
};
