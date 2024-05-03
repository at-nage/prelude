import { Kind } from "../kind";
import { Monoid } from "../monoid";

interface Addition extends Kind {}
class Addition implements Monoid<Addition> {
	value: number;

	constructor(value: number) {
		this.value = value;
	}

	empty = new Addition(0);
	binary = (a: Addition) => new Addition(a.value + this.value);
}

export const addition = (value: number) => new Addition(value);
export const is_addition = <A>(value: A | Addition): value is Addition => value instanceof Addition;
