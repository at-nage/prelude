import { unreachable } from "../errors";
import { Kind, Type } from "../kind";
import { Lambda } from "../lambda";
import { Monad } from "../monad";
import { Semigroup } from "../semigroup";

declare const $either: unique symbol;
type $either = typeof $either;

export interface Either<B = any, A = any> extends Type<$either>, Kind<A, B> {}
export abstract class Either<B = any, A = any> implements Monad<Either<B, A>>, Semigroup<Either<B, A>> {
	abstract map: <Z>(f: (a: A) => Z) => Either<B, Z>;
	abstract pure: (a: A) => Either<B, A>;
	abstract apply: <Z>(f: Either<B, (a: A) => Z>) => Either<B, Z>;
	abstract bind: <Z>(f: (a: A) => Either<B, Z>) => Either<B, Z>;
	abstract binary: (a: Either<B, A>) => Either<B, A>;
}

declare module "../kind" {
	interface KindMap<A, B, C, D> {
		[$either]: Either<B, A>;
	}
}

class Left<B> extends Either<B, any> {	
	value: B;

	constructor(value: B) {
		super();
		this.value = value;
	}

	self = () => this;

	override map: <Z>(f: (a: any) => Z) => Either<B, Z> = this.self;
	override pure: (a: any) => Either<B, any> = right;
	override apply: <Z>(f: Either<B, (a: any) => Z>) => Either<B, Z> = this.self;
	override bind: <Z>(f: (a: any) => Either<B, Z>) => Either<B, Z> = this.self;
	override binary: (a: Either<B, any>) => Either<B, any> = Lambda.self;
}

class Right<A> extends Either<any, A> {
	value: A;

	constructor(value: A) {
		super();
		this.value = value;
	}

	override map: <Z>(f: (a: A) => Z) => Either<any, Z> = (f) => right(f(this.value));
	override pure: (a: A) => Either<any, A> = right;
	override apply: <Z>(f: Either<any, (a: A) => Z>) => Either<any, Z> = either (left) (this.map);
	override bind: <Z>(f: (a: A) => Either<any, Z>) => Either<any, Z> = (f) => f(this.value);
	override binary: (a: Either<any, A>) => Either<any, A> = () => this;
}

export const left = <B>(value: B): Either<B, any> => new Left(value);
export const right = <A>(value: A): Either<any, A> => new Right(value);

export const is_left = <A, B>(maybe: Either<B, A>): maybe is Left<B> => maybe instanceof Left;
export const is_right = <A, B>(maybe: Either<B, A>): maybe is Right<A> => maybe instanceof Right;

export const either = <B, C = void>(on_left: (a: B) => C) => <A>(on_right: (b: A) => C) => (either: Either<B, A>): C => {
	switch (true) {
		case is_right(either):
			return on_right(either.value);
		case is_left(either):
			return on_left(either.value);
		default:
			throw unreachable();
	}
};
