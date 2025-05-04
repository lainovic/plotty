/**
 * Represents a value that may be either a successful result or an error.
 *
 * The `Maybe` class is a container that can hold either a successful result of type `T` or an error of type `E`.
 * It provides a set of methods to handle the success or failure cases.
 *
 * @template E - The type of the error.
 * @template T - The type of the successful result.
 */
export type Success<T> = {
  readonly _tag: "Success";
  readonly value: T;
};

export type Failure<E> = {
  readonly _tag: "Failure";
  readonly error: E;
};

export type Maybe<E, T> = Success<T> | Failure<E>;

export const Maybe = {
  success: <T>(value: T): Success<T> => ({
    _tag: "Success",
    value,
  }),

  failure: <E>(error: E): Failure<E> => ({
    _tag: "Failure",
    error,
  }),

  isSuccess: <E, T>(maybe: Maybe<E, T>): maybe is Success<T> =>
    maybe._tag === "Success",

  isFailure: <E, T>(maybe: Maybe<E, T>): maybe is Failure<E> =>
    maybe._tag === "Failure",

  map: <E, T, U>(maybe: Maybe<E, T>, fn: (value: T) => U): Maybe<E, U> =>
    Maybe.isSuccess(maybe) ? Maybe.success(fn(maybe.value)) : maybe,

  flatMap: <E, T, U>(
    maybe: Maybe<E, T>,
    fn: (value: T) => Maybe<E, U>
  ): Maybe<E, U> => (Maybe.isSuccess(maybe) ? fn(maybe.value) : maybe),

  getOrElse: <E, T>(maybe: Maybe<E, T>, defaultValue: T): T =>
    Maybe.isSuccess(maybe) ? maybe.value : defaultValue,

  ifSuccess: <E, T>(maybe: Maybe<E, T>, fn: (value: T) => void): void => {
    if (Maybe.isSuccess(maybe)) {
      fn(maybe.value);
    }
  },

  ifFailure: <E, T>(maybe: Maybe<E, T>, fn: (error: E) => void): void => {
    if (Maybe.isFailure(maybe)) {
      fn(maybe.error);
    }
  },
};
