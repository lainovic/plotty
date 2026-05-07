export type CrashType = "fatal-exception" | "fatal-signal" | "anr";

export interface CrashEvent {
  readonly type: CrashType;
  readonly description: string;
  readonly lineNumber: number;
  readonly timestamp: number | null;
  /** Index into LogPath.points[] of the last coordinate-bearing point seen before this crash. -1 means the crash preceded all points. */
  readonly nearestPointIndex: number;
}
