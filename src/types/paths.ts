import { GeoPath } from "./geo_types";
import { LogcatPath } from "./logcat_types";
import { RoutePath } from "./route_types";
import { TtpPath } from "./ttp_types";

export type Path = GeoPath | RoutePath | TtpPath | LogcatPath;

export { RoutePath, GeoPath, TtpPath, LogcatPath };
