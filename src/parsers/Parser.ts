import { Maybe, Message } from "../types/common";

export interface ParsedResult<T> {
  result: T;
  message: Message;
}

/**
 * Represents the result of a parsing operation, which can either be a success with a result and a message, or a failure with a message.
 *
 * @template T - The type of the parsed result.
 */
export type MaybeParsed<T> = Maybe<Message, ParsedResult<T>>;

/**
 * Defines the interface for a parser that can parse a given text string into a `DataLayer` object.
 */
export interface Parser<T> {
  parse(text: string): MaybeParsed<T>;
}
