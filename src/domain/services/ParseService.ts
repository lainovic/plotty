import { Path } from "../entities/Path";
import { Maybe } from "../../shared/Maybe";
import RoutingResponseParser from "../parsers/RoutingResponseParser";
import TtpParser from "../parsers/TtpParser";
import GeoPointsParser from "../parsers/GeoPointsParser";
import { MaybeParsed, ParseResult } from "../parsers/Parser";

export class ParseService {
  // The order of parsing is defined here.
  private readonly parsers = [
    new RoutingResponseParser(),
    new TtpParser(),
    new GeoPointsParser(),
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
    const errors: string[] = [];
    for (const parser of this.parsers) {
      const result = parser.parse(input) as MaybeParsed<T>;
      if (result.isSuccess()) {
        return result.result!;
      }
      errors.push(result.error!.value);
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
