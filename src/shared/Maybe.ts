/**
 * Represents a value that may be either a successful result or an error.
 *
 * The `Maybe` class is a container that can hold either a successful result of type `T` or an error of type `E`.
 * It provides a set of methods to handle the success or failure cases.
 *
 * @template E - The type of the error.
 * @template T - The type of the successful result.
 */
export class Maybe<E, T> {
  error: E | null;
  result: T | null;

  constructor(error: E | null = null, result: T | null = null) {
    this.error = error;
    this.result = result;
  }

  static success<E, T>(result: T): Maybe<E, T> {
    return new Maybe<E, T>(null, result);
  }

  static failure<E, T>(error: E): Maybe<E, T> {
    return new Maybe<E, T>(error, null);
  }

  isFailure(): boolean {
    return this.error !== null;
  }
  isSuccess(): boolean {
    return this.result !== null;
  }

  getError(): E | null {
    return this.error;
  }

  getResult(): T | null {
    return this.result;
  }

  ifFailure(callback: (error: E) => void): Maybe<E, T> {
    if (this.isFailure()) {
      callback(this.error!!);
    }
    return this;
  }

  ifSuccess(callback: (result: T) => void): Maybe<E, T> {
    if (this.isSuccess()) {
      callback(this.result!!);
    }
    return this;
  }

  finally(callback: () => void) {
    callback();
  }
}
