import { GeoPoint } from "./types/geo_types";
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

export class GooglePolylineEncodingUtil {
  static MIN_ALLOWED_PRECISION = 5;
  static MAX_ALLOWED_PRECISION = 7;
  static BITS_PER_CHUNK = 5;
  static VALUE_MASK = (1 << GooglePolylineEncodingUtil.BITS_PER_CHUNK) - 1; // 31
  static CONTINUATION_FLAG = 1 << GooglePolylineEncodingUtil.BITS_PER_CHUNK; // 32
  static OFFSET = 63;
  static MIN_LATITUDE = -90;
  static MAX_LATITUDE = 90;
  static MIN_LONGITUDE = -180;
  static MAX_LONGITUDE = 180;

  static decode(encodedPolyline: string, precision: number): GeoPoint[] {
      if (precision < GooglePolylineEncodingUtil.MIN_ALLOWED_PRECISION || 
          precision > GooglePolylineEncodingUtil.MAX_ALLOWED_PRECISION) {
          throw new Error(`Invalid precision for polyline, precision=${precision}`);
      }

      GooglePolylineEncodingUtil.checkEncodedPolylineHasValidCharacters(encodedPolyline);

      const divisor = Math.pow(10, precision);
      const polyline = [];
      let index = 0;
      let latitude: bigint = 0n;
      let longitude: bigint = 0n;

      while (index < encodedPolyline.length) {
          const [dLatitude, newIndex1] = GooglePolylineEncodingUtil.decodeValue(encodedPolyline, index);
          index = newIndex1;

          const [dLongitude, newIndex2] = GooglePolylineEncodingUtil.decodeValue(encodedPolyline, index);
          index = newIndex2;

          latitude += dLatitude;
          if (latitude < GooglePolylineEncodingUtil.MIN_LATITUDE * divisor || 
              latitude > GooglePolylineEncodingUtil.MAX_LATITUDE * divisor) {
              throw new Error(`Latitude not in range. ${latitude}`);
          }

          longitude += dLongitude;
          if (longitude < GooglePolylineEncodingUtil.MIN_LONGITUDE * divisor || 
              longitude > GooglePolylineEncodingUtil.MAX_LONGITUDE * divisor) {
              throw new Error(`Longitude not in range. ${longitude}`);
          }

          polyline.push({
              latitude: Number(latitude) / divisor,
              longitude: Number(longitude) / divisor
          });
      }

      return polyline;
  }

  static decodeValue(encodedPolyline: string, index: number): [bigint, number] {
      let result: bigint = 0n;
      let shift = 0;
      let currentIndex = index;
      let chunk;

      do {
          if (currentIndex >= encodedPolyline.length) {
              throw new Error("Invalid encoded polyline.");
          }

          chunk = encodedPolyline.charCodeAt(currentIndex++) - GooglePolylineEncodingUtil.OFFSET;
          result |= BigInt(chunk & GooglePolylineEncodingUtil.VALUE_MASK) << BigInt(shift);
          shift += GooglePolylineEncodingUtil.BITS_PER_CHUNK;
      } while (chunk >= GooglePolylineEncodingUtil.CONTINUATION_FLAG);

      const decodedValue = (result & 1n) !== 0n ? ~(result >> 1n) : result >> 1n;
      return [decodedValue, currentIndex];
  }

  static encode(polyline: GeoPoint[], precision: number) {
      if (precision < GooglePolylineEncodingUtil.MIN_ALLOWED_PRECISION || 
          precision > GooglePolylineEncodingUtil.MAX_ALLOWED_PRECISION) {
          throw new Error(`Invalid precision for polyline, precision=${precision}`);
      }

      const multiplier = Math.pow(10, precision);
      let lastLatitude = 0;
      let lastLongitude = 0;
      let result = "";

      for (const point of polyline) {
          const latitude = Math.round(point.latitude * multiplier);
          const longitude = Math.round(point.longitude * multiplier);

          result += GooglePolylineEncodingUtil.encodeValue(latitude - lastLatitude);
          result += GooglePolylineEncodingUtil.encodeValue(longitude - lastLongitude);

          lastLatitude = latitude;
          lastLongitude = longitude;
      }

      return result;
  }

  static encodeValue(value: number): string { 
      let v = value < 0 ? ~(value << 1) : value << 1;
      let result = "";

      while (v >= GooglePolylineEncodingUtil.CONTINUATION_FLAG) {
          result += String.fromCharCode((32 | (v & 31)) + GooglePolylineEncodingUtil.OFFSET);
          v >>>= GooglePolylineEncodingUtil.BITS_PER_CHUNK;
      }

      result += String.fromCharCode(v + GooglePolylineEncodingUtil.OFFSET);
      return result;
  }

  static checkEncodedPolylineHasValidCharacters(encodedPolyline: string) {
      for (const c of encodedPolyline) {
          const asciiCode = c.charCodeAt(0);
          if (asciiCode < GooglePolylineEncodingUtil.OFFSET || 
              asciiCode > (GooglePolylineEncodingUtil.OFFSET + (GooglePolylineEncodingUtil.VALUE_MASK | GooglePolylineEncodingUtil.CONTINUATION_FLAG))) {
              throw new Error(`Invalid encoded polyline, invalid character:${c}, asciiCode:${asciiCode}`);
          }
      }
  }
}
