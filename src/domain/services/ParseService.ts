import { Path } from "../entities/Path";
import RouteParser from "../parsers/RouteParser";
import TtpParser from "../parsers/TtpParser";
import GeoPointsParser from "../parsers/GeoPointsParser";
import { ParseResult } from "../parsers/Parser";
import { LogcatParser } from "../parsers/logcat/LogcatParser";
import { Maybe } from "../../shared/Maybe";
import { MaybeParsed } from "../parsers/Parser";

export class ParseService {
  // The order of parsing is defined here.
  private readonly parsers = [
    new RouteParser(),
    new TtpParser(),
    new LogcatParser(),
    new GeoPointsParser(),
  ];

  public parse<T extends Path<any>>(input: string): ParseResult<T> {
    if (input === "") {
      return { paths: [], message: "The input is empty." };
    }

    const errors: string[] = [];
    for (const parser of this.parsers) {
      const result = parser.parse(input) as MaybeParsed<T>;
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
