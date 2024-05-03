import { Kind } from "../kind";
import { Monoid } from "../monoid";

interface Multiplication extends Kind {}
class Multiplication implements Monoid<Multiplication> {
	value: number;

	constructor(value: number) {
		this.value = value;
	}

	empty = new Multiplication(1);
	binary = (a: Multiplication) => new Multiplication(a.value * this.value);
}

export const multiplication = (value: number) => new Multiplication(value);
export const is_multiplication = <A>(value: A | Multiplication): value is Multiplication => value instanceof Multiplication;
