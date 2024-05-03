class Numeric {
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  static plus = (a: number) => (b: number) => a + b;
  static minus = (a: number) => (b: number) => a - b;
  static power = (a: number) => (b: number) => a ** b;
}

export const numeric = (value: number) => new Numeric(value);
export const is_numeric = <A>(value: A | Numeric): value is Numeric => value instanceof Numeric;
