import Layer from "./model/Layer";
import { Path } from "../types/paths";

export function filter<T>(
  paths: Path[],
  typeT: new (...params: any[]) => T
): T[] {
  return paths.filter((item) => item instanceof typeT) as T[];
}

export function pathsToLayers<T extends Path>(
  paths: Path[],
  typeT: new (...params: any[]) => T
): Layer[] {
  return filter(paths, typeT).map((path) => new Layer(path)) as Layer[];
}
