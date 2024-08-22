import { MaybeParsed, Parser } from "./Parser";
import { Maybe } from "../types/common";
import { GeoPath, GeoPoint } from "../types/geo_types";

export default class GeoPointsParser implements Parser<GeoPath[]> {
  parse(text: string): MaybeParsed<GeoPath[]> {
    const regex_raw_coordinates = /([\d.-]+)[,\s]+([\d.-]+)/g;
    const regex_raw_coordinates_with_named_args =
      /(?:lat|latitude)\s?[=:]\s?([\d.-]+)[,\s]+(?:lon|long|lng|longitude)\s?[=:]\s?([\d.-]+)/g;
    const regexes = [
      regex_raw_coordinates_with_named_args,
      regex_raw_coordinates,
    ];
    const points: GeoPoint[] = [];
    let match: RegExpExecArray | null;
    for (let regex of regexes) {
      while ((match = regex.exec(text))) {
        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[2]);
        if (latitude && longitude) {
          points.push({
            latitude: latitude,
            longitude: longitude,
          });
        }
      }
      if (points.length > 0) {
        break;
      }
    }

    if (points.length === 0) {
      return Maybe.failure({
        value: "No geo points found",
      });
    } else {
      return Maybe.success({
        result: [new GeoPath(points)],
        message: { value: "Parsed as geo points" },
      });
    }
  }
}
