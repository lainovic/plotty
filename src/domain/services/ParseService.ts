import { Path } from "../entities/Path";
import { Maybe } from "../../shared/Maybe";
import RouteParser from "../parsers/RouteParser";
import TtpParser from "../parsers/TtpParser";
import GeoPointsParser from "../parsers/GeoPointsParser";
import { MaybeParsed, ParseResult } from "../parsers/Parser";
import { LogcatParser } from "../parsers/logcat/LogcatParser";

export class ParseService {
  // The order of parsing is defined here.
  private readonly oneLineParser = new GeoPointsParser();

  private readonly parsers = [
    new RouteParser(),
    new TtpParser(),
    new LogcatParser(),
  ];

  public parse<T extends Path<any>>(input: string): MaybeParsed<T> {
    if (input === "") {
      return Maybe.success({
        paths: [],
        message: { value: "The input is empty." },
      });
    }

    try {
      const result = this.parseInput<T>(input);
      return Maybe.success(result);
    } catch (error: unknown) {
      let errorMessage;
      if (error instanceof ParsingError) {
        errorMessage = error.message;
      } else {
        errorMessage = `${error}`;
      }
      return Maybe.failure({ value: errorMessage });
    }
  }

  private parseInput<T extends Path<any>>(input: string): ParseResult<T> {
    if (countLines(input) == 1) {
      const result = this.oneLineParser.parse(input) as MaybeParsed<T>;
      if (Maybe.isSuccess(result)) {
        return result.value;
      }
    }

    const errors: string[] = [];
    for (const parser of this.parsers) {
      const result = parser.parse(input) as MaybeParsed<T>;
      if (Maybe.isSuccess(result)) {
        return result.value;
      }
      errors.push(result.error.value);
    }
    // If we got here, then no parser succeeded.
    throw new ParsingError(
      `Failed to parse input from all parsers with errros: ${errors.join("; ")}`
    );
  }
}

class ParsingError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function countLines(text: string): number {
  return (text.match(/\n/g) || []).length + 1;
}
