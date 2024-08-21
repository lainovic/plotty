import { Path } from "./types/paths";

/**
 * Removes the first element from the given array and returns the remaining elements.
 * @param array - The input array.
 * @returns A new array with the first element removed.
 */
export const dropFirst = <T>(array: T[]): T[] => array.slice(1);

/**
 * Removes the last element from the given array and returns the remaining elements.
 * @param array - The input array.
 * @returns A new array with the last element removed.
 */
export const dropLast = <T>(array: T[]): T[] =>
  array.slice(0, array.length - 1);

/**
 * Returns the last element of the given array.
 * @param array - The input array.
 * @returns The last element of the array.
 */
export const last = <T>(array: T[]): T => array[array.length - 1];

/**
 * Returns the first element of the given array.
 * @param array - The input array.
 * @returns The first element of the array.
 */
export const first = <T>(array: T[]): T => array[0];

/**
 * Calculates the bounding box for the given path.
 *
 * @param path - The path to calculate the bounding box for.
 * @returns The bounding box for the path, or `null` if the path is empty.
 */
export function getBoundingBox(path: Path): BoundingBox {
  const latitudes = path.points.map((point) => point.latitude);
  const longitudes = path.points.map((point) => point.longitude);

  const boundingBox = {
    minLatitude: Math.min(...latitudes),
    maxLatitude: Math.max(...latitudes),
    minLongitude: Math.min(...longitudes),
    maxLongitude: Math.max(...longitudes),
  };

  return boundingBox;
}

/**
 * The bounding box of a geographic area,
 * used to define the visible area of a map, for purposes such as
 * centering the map.
 */
type BoundingBox = {
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
};
