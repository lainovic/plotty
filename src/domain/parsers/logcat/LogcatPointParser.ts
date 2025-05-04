import { LogcatEntry } from "../../value-objects/LogcatEntry";
import { LogLevel } from "../../value-objects/LogLevel";
import { LogPoint } from "../../value-objects/LogPoint";
import { LogcatMessage } from "./LogcatMessageParser";
import { Optional } from "../../../shared/Optional";

export class LogcatPointParser {
  /**
   * Creates a LogPoint from a LogcatEntry and ParseResult.
   * @param entry The LogcatEntry to parse
   * @param result The ParseResult containing coordinates and extra data
   * @param lineNumber The line number in the original log file
   * @returns Optional<LogPoint> containing the parsed point if successful,
   * or Optional.none() if:
   * - The log level is not supported
   * - An error occurs during parsing
   */
  static parse(
    entry: LogcatEntry,
    result: LogcatMessage,
    lineNumber: number
  ): Optional<LogPoint> {
    try {
      const logLevel = LogcatPointParser.extractLogLevel(entry.level);
      const { latitude, longitude, extra } = result;
      return Optional.some(
        new LogPoint(
          latitude,
          longitude,
          logLevel,
          entry.tag,
          lineNumber,
          extra
        )
      );
    } catch (error: any) {
      return Optional.none();
    }
  }

  private static extractLogLevel(text: string): LogLevel {
    switch (text) {
      case "I":
      case "INFO":
        return LogLevel.Info;
      case "W":
      case "WARN":
        return LogLevel.Warn;
      case "E":
      case "ERROR":
        return LogLevel.Error;
      case "D":
      case "DEBUG":
        return LogLevel.Debug;
      case "T":
      case "TRACE":
        return LogLevel.Trace;
      case "V":
      case "VERBOSE":
        return LogLevel.Verbose;
      default:
        throw new Error(`Unknown log level: ${text}`);
    }
  }
}
