import { GeoPath } from "../entities/GeoPath";
import { Coordinates } from "../value-objects/Coordinates";
import { Maybe } from "../../shared/Maybe";
import { MaybeParsed, Parser } from "./Parser";

const GEOJSON_TYPES = new Set([
  "Point", "MultiPoint", "LineString", "MultiLineString",
  "Polygon", "MultiPolygon", "Feature", "FeatureCollection", "GeometryCollection",
]);

type GeoJsonPosition = [number, number];
type GeoJsonProperties = Record<string, unknown>;

type GeoJsonGeometry =
  | { type: "Point"; coordinates: GeoJsonPosition }
  | { type: "MultiPoint"; coordinates: GeoJsonPosition[] }
  | { type: "LineString"; coordinates: GeoJsonPosition[] }
  | { type: "MultiLineString"; coordinates: GeoJsonPosition[][] }
  | { type: "Polygon"; coordinates: GeoJsonPosition[][] }
  | { type: "MultiPolygon"; coordinates: GeoJsonPosition[][][] }
  | { type: "GeometryCollection"; geometries?: GeoJsonGeometry[] };

type GeoJsonFeature = {
  type: "Feature";
  geometry?: GeoJsonGeometry;
  properties?: GeoJsonProperties & { name?: string };
};

type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features?: GeoJsonFeature[];
};

type GeoJsonNode = GeoJsonGeometry | GeoJsonFeature | GeoJsonFeatureCollection;

function isGeoJsonNode(value: unknown): value is GeoJsonNode {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    typeof value.type === "string" &&
    GEOJSON_TYPES.has(value.type)
  );
}

export default class GeoJsonParser implements Parser<GeoPath> {
  parse(text: string): MaybeParsed<GeoPath> {
    try {
      const json = JSON.parse(text) as unknown;
      if (!isGeoJsonNode(json)) {
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

  private extract(node: GeoJsonNode, name: string | undefined, properties?: GeoJsonProperties): GeoPath[] {
    switch (node.type) {
      case "FeatureCollection":
        return (node.features ?? []).flatMap((feature) => this.extract(feature, undefined));

      case "Feature":
        return node.geometry
          ? this.extract(
            node.geometry,
            node.properties?.name ?? name,
            node.properties ?? undefined,
          )
          : [];

      case "GeometryCollection":
        return (node.geometries ?? []).flatMap((geometry) => this.extract(geometry, name, properties));

      default:
        return this.fromGeometry(node, name, properties);
    }
  }

  private fromGeometry(geom: Exclude<GeoJsonGeometry, { type: "GeometryCollection" }>, name: string | undefined, properties?: GeoJsonProperties): GeoPath[] {
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

  private openRing(ring: GeoJsonPosition[]): GeoJsonPosition[] {
    if (ring.length < 2) return ring;
    const first = ring[0], last = ring[ring.length - 1];
    return first[0] === last[0] && first[1] === last[1] ? ring.slice(0, -1) : ring;
  }

  private toCoords = ([lng, lat]: GeoJsonPosition): Coordinates =>
    new Coordinates(lat, lng);

  private suffix(name: string | undefined, index: number, total: number): string | undefined {
    if (total <= 1) return name;
    return name ? `${name} (${index + 1})` : undefined;
  }
}
