import { unreachable } from "../errors";
import { Kind, Type } from "../kind";
import { Lambda } from "../lambda";
import { Monad } from "../monad";
import { Monoid } from "../monoid";
import { Semigroup, binary } from "../semigroup";

declare const $list: unique symbol;
type $list = typeof $list;

const empty = <A = any>(): List<A> => new Empty();
const node = <A>(head: A, tail?: List<A>): List<A> => new Node(head, tail ?? empty());

const is_empty = <A>(maybe: List<A>): maybe is Empty => maybe instanceof Empty;
const is_node = <A>(maybe: List<A>): maybe is Node<A> => maybe instanceof Node;

export interface List<A = any> extends Type<$list>, Kind<A> {}
export abstract class List<A = any> implements Monad<List<A>>, Monoid<List<A>> {
	abstract map: <B>(f: (a: A) => B) => List<B>;
	abstract pure: (a: A) => List<A>;
	abstract apply: <B>(f: List<(a: A) => B>) => List<B>;
	abstract bind: <B>(f: (a: A) => List<B>) => List<B>;
	abstract binary: <B extends Semigroup>(fb: List<A> & Kind<B>) => List<A>;
	empty: List<A> = empty();

	static empty = empty;
	static node = node;
	static is_empty = is_empty;
	static is_node = is_node;

	static assert = <A>(list: List<A>) => {
		if(is_node(list)) return list;
		throw unreachable();
	}

	static head = <A>(list: List<A>) => {
		if (is_node(list)) return list.head;
		throw unreachable();
	};

	static tail = <A>(list: List<A>) => {
		if (is_node(list)) return list.tail;
		throw unreachable();
	};

	static last = <A>(list: List<A>): A => {
		const { head, tail } = List.assert(list);

		if (is_node(tail)) {
			return List.last(tail);
		}

		return head;
	};

  static init = <A>(list: List<A>): List<A> => {
		const { head, tail } = List.assert(list);

		if (is_node(tail)) {
			return node(head, List.init(tail));
		}

		return empty();
  }
  
	static match = <A, Z = void>(on_node: (a: A) => Z, on_empty: () => Z) => (list: List<A>): Z => {
    switch (true) {
      case is_node(list):
        return on_node(list.head);
      case is_empty(list):
        return on_empty();
      default:
        throw unreachable();
    }
  };
}

declare module "../kind" {
	interface KindMap<A, B, C, D> {
		[$list]: List<A>;
	}
}

class Empty extends List {
	private static instance = new Empty();

	constructor() {
		super();
		return Empty.instance;
	}

	override map: <B>(f: (a: any) => B) => List<B> = empty;
	override pure: (a: any) => List<any> = node;
	override apply: <B>(f: List<(a: any) => B>) => List<B> = empty;
	override bind: <B>(f: (a: any) => List<B>) => List<B> = empty;
	override binary: (fb: List<any>) => List<any> = empty;
}

class Node<A> extends List<A> {
	head: A;
	tail: List<A>;

	constructor(head: A, tail: List<A>) {
		super();
		this.head = head;
		this.tail = tail;
	}

	override map: <B>(f: (a: A) => B) => List<B> = (f) => node(f(this.head), this.tail.map(f));
	override pure: (a: A) => List<A> = node;
	override apply: <B>(f: List<(a: A) => B>) => List<B> = List.match(this.map, empty);
	override bind: <B>(f: (a: A) => List<B>) => List<B> = (f) => f(this.head);
	override binary: <B extends Semigroup>(fb: List<A> & Kind<B>) => List<A> = List.match(
		Lambda.compose(
			binary(() => this.head as any),
			node,
		),
		empty,
	);
}

export const list = <T>(...items: T[]): List<T> => {
	return items.reduceRight((tail, head) => node(head, tail), empty());
};
