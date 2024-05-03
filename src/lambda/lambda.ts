import { Compose, Merge } from "./types";

export type Lambda<A = any, Z = any> = (arg: A) => Z;

export const is_lambda = <A, T, R>(lambda: A | Lambda<T, R>): lambda is Lambda<T, R>  => {
  return typeof lambda === 'function';
}

export namespace Lambda {
	export const empty = () => {};
	export const self = <T>(value: T) => value;
	export const always = (): true => true;
	export const never = (): false => false;

	export const toggle = (boolean: boolean) => !boolean;

	export function call(lambda: Lambda<void, void> | undefined): void;
	export function call<R>(lambda: Lambda<void, R>): R;
	export function call<R>(lambda: Lambda<void, R> | undefined) {
		return lambda?.();
	}

	export const compose: Compose = <A>(...lambdas: Lambda<A, A>[]) => {
		return (arg: A) => lambdas.reduce((arg, lambda) => lambda(arg), arg);
	};

	export const merge: Merge = <A>(...lambdas: Lambda<A, A>[]) => {
		return (args: A) => lambdas.reduce((result, behavior) => Object.assign(result, behavior(args)), {});
	};
}
