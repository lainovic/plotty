import { Maybe } from "../../shared/Maybe";
import { Message } from "../../shared/Message";
import { Path } from "../entities/Path";

export interface ParseResult<T extends Path<any>> {
  paths: T[];
  message: Message;
}

/**
 * Represents the result of a parsing operation, which can either be a success with a result and a message, or a failure with a message.
 *
 * @template T - The type of the parsed result.
 */
export type MaybeParsed<T extends Path<any>> = Maybe<Message, ParseResult<T>>;

export interface Parser<T extends Path<any>> {
  parse(input: string): MaybeParsed<T>;
}
