import { Maybe } from "../../../shared/Maybe";
import { LogPath } from "../../entities/LogPath";
import { LogPoint } from "../../value-objects/LogPoint";
import { MaybeParsed, Parser } from "../Parser";
import { LogcatEntryParser } from "./LogcatEntryParser";
import { LogcatMessageParser } from "./LogcatMessageParser";
import { LogcatPointParser } from "./LogcatPointParser";

export class LogcatParser implements Parser<LogPath> {
  parse(text: string): MaybeParsed<LogPath> {
    try {
      const points: LogPoint[] = [];
      const lines = text.split("\n");

      lines.forEach((line: string, lineNumber: number) => {
        try {
          const entry = LogcatEntryParser.parse(line);
          if (entry !== null) {
            const message = LogcatMessageParser.parse(entry);
            if (message !== null) {
              const point = LogcatPointParser.parse(entry, message, lineNumber);
              if (point !== null) points.push(point);
            }
          }
        } catch (error: any) {
          console.error(`Error parsing a Logcat point: ${error.message}`);
        }
      });

      if (points.length === 0) {
        return Maybe.failure({ value: "No routes found in the given logcat." });
      }

      return Maybe.success({
        paths: [new LogPath(points)],
        message: { value: "Parsed Logcat successfully." },
      });
    } catch (error: any) {
      return Maybe.failure({
        value: `Error parsing as logcat: ${error.message}`,
      });
    }
  }
}
