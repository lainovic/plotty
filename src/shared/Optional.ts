export class Optional<T> {
  private constructor(private readonly value: T | null) {}

  static some<T>(value: T): Optional<T> {
    return new Optional(value);
  }

  static none<T>(): Optional<T> {
    return new Optional<T>(null);
  }

  isSome(): boolean {
    return this.value !== null;
  }

  isNone(): boolean {
    return this.value === null;
  }

  get(): T {
    if (this.value === null) {
      throw new Error("Cannot get value from None");
    }
    return this.value;
  }

  getOrValue(defaultValue: T): T {
    return this.isNone() ? defaultValue : this.get();
  }

  map<U>(fn: (value: T) => U): Optional<U> {
    if (this.isNone()) {
      return Optional.none<U>();
    }
    return Optional.some(fn(this.get()));
  }

  flatMap<U>(fn: (value: T) => Optional<U>): Optional<U> {
    if (this.isNone()) {
      return Optional.none<U>();
    }
    return fn(this.get());
  }

  ifSome(fn: (value: T) => void) {
    if (this.isNone()) return;
    fn(this.get());
  }
}
