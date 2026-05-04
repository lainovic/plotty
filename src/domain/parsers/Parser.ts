import { Maybe } from "../../shared/Maybe";
import { AnyPath } from "../entities/Path";

export interface ParseResult<T extends AnyPath> {
  paths: T[];
  message: string;
}

/**
 * Represents the result of a parsing operation, which can either be a success with a result and a message, or a failure with a message.
 *
 * @template T - The type of the parsed result.
 */
export type MaybeParsed<T extends AnyPath> = Maybe<string, ParseResult<T>>;

export interface Parser<T extends AnyPath> {
  parse(input: string): MaybeParsed<T>;
}
