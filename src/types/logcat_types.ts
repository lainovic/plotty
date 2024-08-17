import { GeoPoint } from "./geo_types";
import { Path } from "./common";

/**
 * Represents the type of a log level, either "INFO", "WARNING", or "ERROR".
 */
export enum LogLevel {
  Info = "INFO",
  Warning = "WARNING",
  Error = "ERROR",
}

/**
 * Represents a point coming from a Logcat that contains a geographic location, timestamp,
 * log level, and message associated with the log entry.
 *
 * @property {GeoPoint} point - The geographic coordinates of the point.
 * @property {number} timestamp - The timestamp of the point.
 * @property {LogLevel} logLevel - The log level of the message.
 * @property {string} message - The message associated with the point.
 */
export interface LogcatPoint extends GeoPoint {
  timestamp: number;
  logLevel: LogLevel;
  message: string;
}

/**
 * Represents a collection of points from a Logcat.
 * Can't be just Path<LogcatPoint> because instanceof doesn't work with types.
 */
export class LogcatPath extends Path<LogcatPoint> {
  constructor(points: LogcatPoint[]) {
    super(points);
  }
}
