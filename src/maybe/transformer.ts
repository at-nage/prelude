import { Either } from "src/either";
import { B, C, D, Kind, ToKind, Type } from "src/kind";
import { Monad } from "src/monad";

import { Maybe, just } from "./maybe";
import { Lambda } from "..";

declare const $maybe_t: unique symbol;
type $maybe_t = typeof $maybe_t;

export interface MaybeT<M  extends Monad = Monad, A = never> extends Type<$maybe_t>, Kind<A> {}
export class MaybeT<M extends Monad = Monad, A = never> implements Monad<MaybeT<M, A>> {
	// pure: (a: A) => MaybeT<M, A>;
	monad: M;

	pure;

	constructor(monad: M & Kind<Maybe<A>>) {
		this.monad = monad;
		this.pure = Lambda.compose(just, monad.pure, MaybeT.create);
	}

	map = <Z>(f: (a: A) => Z) => MaybeT.create(this.monad.map(f));
	// apply = ;

  // bind: <B>(f: (a: A) => MaybeT<ToKind<B, Maybe<never>, B<B>, C<B>, D<B>>, never>) => MaybeT<ToKind<B, Maybe<never>, B<...>, C<...>, D<...>>, never>;
	// bind = ;

	// map: <Z>(f: (a: A) => Z) => MaybeT<M, Z>;

	// pure: (a: A) => MaybeT<ToKind<A, Maybe<never>, B<A>, C<A>, D<A>>, never> = Lambda.compose(this.m_pure, just);

	// abstract map: <B>(f: (a: A) => B) => Maybe<B>;
	// abstract pure: (a: A) => Maybe<A>;
	// abstract apply: <B>(f: Maybe<(a: A) => B>) => Maybe<B>;
	// abstract bind: <B>(f: (a: A) => Maybe<B>) => Maybe<B>;
	// abstract binary: <B extends Semigroup>(fb: Maybe<A> & Kind<B>) => Maybe<A>;
	// abstract empty: Maybe<A>;

	// static run = <A, M extends Monad>(m: M & Kind<A>) => (a: A): MaybeT<M, A> => new MaybeT(m, a);
	static wrap = <A, M extends Monad>(m: M & Kind<Maybe<A>>) => new MaybeT<M, A>(m);
	static unwrap = <M extends Monad = Monad, A = never>(m: MaybeT<M, A>) => m.monad;
} 

declare module "../kind" {
	interface KindMap<A, B, C, D> {
		[$maybe_t]: MaybeT<ToKind<A, Maybe<B>>>;
	}
}

// export interface Result<B = any, A = any> extends Type<$maybe_t>, Kind<A, B> {}
// export abstract class Result<B = any, A = any> extends MaybeT<Either, A> {
// 	override map: <Z>(f: (a: A) => Z) => Either<B, Maybe<Z>> = null!;
// }

export const result: MaybeT<Either<string, Maybe<number>>, number> = null!;
