import { Lambda } from "./lambda";

export type Arguments<T extends Lambda> = T extends {
	(arg: infer P1): any;
	(arg: infer P2): any;
	(arg: infer P3): any;
	(arg: infer P4): any;
}
	? P1 | P2 | P3 | P4
	: T extends { (arg: infer P1): any; (arg: infer P2): any; (arg: infer P3): any }
	? P1 | P2 | P3
	: T extends { (arg: infer P1): any; (arg: infer P2): any }
	? P1 | P2
	: T extends (arg: infer P) => any
	? P
	: never;

export type Returns<T extends Lambda> = T extends {
  (arg: any): infer R1;
	(arg: any): infer R2;
	(arg: any): infer R3;
	(arg: any): infer R4;
}
	? R1 | R2 | R3 | R4
	: T extends { (arg: any): infer R1; (arg: any): infer R2; (arg: any): infer R3 }
	? R1 | R2 | R3
	: T extends { (arg: any): infer R1; (arg: any): infer R2 }
	? R1 | R2
	: T extends (arg: any) => infer R
	? R
	: never;


export interface Compose {
	<A, B, C>(first: Lambda<A, B>, second: Lambda<B, C>): Lambda<A, C>;
	<A, B, C, D>(first: Lambda<A, B>, second: Lambda<B, C>, third: Lambda<C, D>): Lambda<
		A,
		D
	>;
	<A, B, C, D, E>(
		first: Lambda<A, B>,
		second: Lambda<B, C>,
		third: Lambda<C, D>,
		fourth: Lambda<D, E>,
	): Lambda<[A], E>;
	<A, B, C, D, E, F>(
		first: Lambda<A, B>,
		second: Lambda<B, C>,
		third: Lambda<C, D>,
		fourth: Lambda<D, E>,
		fifth: Lambda<D, F>,
	): Lambda<[A], F>;
	<A, B, C, D, E, F, G>(
		first: Lambda<A, B>,
		second: Lambda<B, C>,
		third: Lambda<C, D>,
		fourth: Lambda<D, E>,
		fifth: Lambda<E, F>,
		sixth: Lambda<F, G>,
	): Lambda<[A], G>;
}

export interface Merge {
	<A, B, C>(first: Lambda<A, B>, second: Lambda<A, C>): Lambda<A, B & C>;
	<A, B, C, D>(
		first: Lambda<A, B>,
		second: Lambda<A, C>,
		third: Lambda<A, D>,
	): Lambda<A, B & C & D>;
	<A, B, C, D, E>(
		first: Lambda<A, B>,
		second: Lambda<A, C>,
		third: Lambda<A, D>,
		fourth: Lambda<A, E>,
	): Lambda<A, B & C & D & E>;
	<A, B, C, D, E, F>(
		first: Lambda<A, B>,
		second: Lambda<A, C>,
		third: Lambda<A, D>,
		fourth: Lambda<A, E>,
		fifth: Lambda<A, B & C & D & E & F>,
	): Lambda<A, F>;
	<A, B, C, D, E, F>(
		first: Lambda<A, B>,
		second: Lambda<A, C>,
		third: Lambda<A, D>,
		fourth: Lambda<A, E>,
		fifth: Lambda<A, F>,
		sixth: Lambda<A, F>,
	): Lambda<A, B & C & D & E & F & F>;
}
