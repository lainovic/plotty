import { GeoPath } from "./geo_types";
import { LogcatPath } from "./logcat_types";
import { RoutePath } from "./route_types";
import { TtpPath } from "./ttp_types";

export function filter<T>(
  paths: Path[],
  typeT: new (...params: any[]) => T
): T[] {
  return paths.filter((item) => item instanceof typeT) as T[];
}

export type Path = GeoPath | RoutePath | TtpPath | LogcatPath;

export { RoutePath, GeoPath, TtpPath, LogcatPath };
