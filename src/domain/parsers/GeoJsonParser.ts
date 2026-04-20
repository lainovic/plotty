import { GeoPath } from "../entities/GeoPath";
import { Coordinates } from "../value-objects/Coordinates";
import { Maybe } from "../../shared/Maybe";
import { MaybeParsed, Parser } from "./Parser";

const GEOJSON_TYPES = new Set([
  "Point", "MultiPoint", "LineString", "MultiLineString",
  "Polygon", "MultiPolygon", "Feature", "FeatureCollection", "GeometryCollection",
]);

export default class GeoJsonParser implements Parser<GeoPath> {
  parse(text: string): MaybeParsed<GeoPath> {
    try {
      const json = JSON.parse(text);
      if (!json || typeof json !== "object" || !GEOJSON_TYPES.has(json.type)) {
        return Maybe.failure("Not a GeoJSON object");
      }

      const paths = this.extract(json, undefined);
      if (paths.length === 0) {
        return Maybe.failure("No geometry found in GeoJSON");
      }

      return Maybe.success({
        paths,
        message: `Parsed GeoJSON: ${paths.length} layer${paths.length !== 1 ? "s" : ""}.`,
      });
    } catch {
      return Maybe.failure("Not valid GeoJSON");
    }
  }

  private extract(node: any, name: string | undefined, properties?: Record<string, unknown>): GeoPath[] {
    switch (node?.type) {
      case "FeatureCollection":
        return (node.features ?? []).flatMap((f: any) => this.extract(f, undefined));

      case "Feature":
        return this.extract(
          node.geometry,
          node.properties?.name ?? name,
          node.properties ?? undefined,
        );

      case "GeometryCollection":
        return (node.geometries ?? []).flatMap((g: any) => this.extract(g, name, properties));

      default:
        return this.fromGeometry(node, name, properties);
    }
  }

  private fromGeometry(geom: any, name: string | undefined, properties?: Record<string, unknown>): GeoPath[] {
    if (!geom?.coordinates) return [];

    switch (geom.type) {
      case "Point":
        return [new GeoPath([this.toCoords(geom.coordinates)], name, "points", properties)];

      case "MultiPoint":
        return [new GeoPath(geom.coordinates.map(this.toCoords), name, "points", properties)];

      case "LineString":
        return [new GeoPath(geom.coordinates.map(this.toCoords), name, "line", properties)];

      case "MultiLineString":
        return geom.coordinates.map((line: number[][], i: number) =>
          new GeoPath(line.map(this.toCoords), this.suffix(name, i, geom.coordinates.length), "line", properties)
        );

      case "Polygon": {
        const ring: number[][] = geom.coordinates[0] ?? [];
        return [new GeoPath(this.openRing(ring).map(this.toCoords), name, "polygon", properties)];
      }

      case "MultiPolygon":
        return geom.coordinates.map((polygon: number[][][], i: number) =>
          new GeoPath(
            this.openRing(polygon[0] ?? []).map(this.toCoords),
            this.suffix(name, i, geom.coordinates.length),
            "polygon",
            properties,
          )
        );

      default:
        return [];
    }
  }

  private openRing(ring: number[][]): number[][] {
    if (ring.length < 2) return ring;
    const first = ring[0], last = ring[ring.length - 1];
    return first[0] === last[0] && first[1] === last[1] ? ring.slice(0, -1) : ring;
  }

  private toCoords = ([lng, lat]: number[]): Coordinates =>
    new Coordinates(lat, lng);

  private suffix(name: string | undefined, index: number, total: number): string | undefined {
    if (total <= 1) return name;
    return name ? `${name} (${index + 1})` : undefined;
  }
}
