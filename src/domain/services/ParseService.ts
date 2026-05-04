import { AnyPath } from "../entities/Path";
import RouteParser from "../parsers/RouteParser";
import TtpParser from "../parsers/TtpParser";
import GeoPointsParser from "../parsers/GeoPointsParser";
import { ParseResult, Parser } from "../parsers/Parser";
import { LogcatParser } from "../parsers/logcat/LogcatParser";
import GeoJsonParser from "../parsers/GeoJsonParser";
import { Maybe } from "../../shared/Maybe";

export class ParseService {
  // The order of parsing is defined here.
  private readonly parsers: Parser<AnyPath>[] = [
    new RouteParser(),
    new TtpParser(),
    new LogcatParser(),
    new GeoJsonParser(),
    new GeoPointsParser(),
  ];

  public parse(input: string): ParseResult<AnyPath> {
    if (input === "") {
      return { paths: [], message: "The input is empty." };
    }

    const errors: string[] = [];
    for (const parser of this.parsers) {
      const result = parser.parse(input);
      if (Maybe.isSuccess(result)) {
        return result.value;
      }
      errors.push(result.error);
    }

    throw new Error(
      `Failed to parse input from all parsers: ${errors.join("; ")}`
    );
  }
}
