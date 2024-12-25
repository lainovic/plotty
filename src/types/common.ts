/**
 * Represents a geographic position with latitude and longitude coordinates.
 */
export type Position = {
  latitude: number;
  longitude: number;
};

/**
 * Represents a generic path composed of a sequence of points.
 */
export class Path<T> {
  points: T[];
  name: string;
  empty(): boolean {
    return this.points.length === 0;
  }
  isNotEmpty(): boolean {
    return !this.empty();
  }
  constructor(points: T[], name: string = "") {
    this.points = points;
    this.name = name;
    console.log(`Path ${name} created with ${points.length} points`);
  }
}

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

/**
 * Represents a message with a text.
 */
export type Message = {
  value: string;
};
