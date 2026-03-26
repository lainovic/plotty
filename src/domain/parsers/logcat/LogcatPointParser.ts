import { LogcatEntry } from "../../value-objects/LogcatEntry";
import { LogLevel } from "../../value-objects/LogLevel";
import { LogPoint } from "../../value-objects/LogPoint";
import { LogcatMessage } from "./LogcatMessageParser";

export class LogcatPointParser {
  static parse(
    entry: LogcatEntry,
    result: LogcatMessage,
    lineNumber: number
  ): LogPoint | null {
    try {
      const logLevel = LogcatPointParser.extractLogLevel(entry.level);
      const { latitude, longitude, extra } = result;
      return new LogPoint(latitude, longitude, logLevel, entry.tag, lineNumber, extra);
    } catch {
      return null;
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
