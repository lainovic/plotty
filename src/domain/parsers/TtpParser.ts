import { Maybe } from "../../shared/Maybe";
import { TtpPath } from "../entities/TtpPath";
import { TtpPoint, TtpPointType } from "../value-objects/TtpPoint";
import { MaybeParsed, Parser } from "./Parser";

const supportedVersion = "0.7";

export default class TtpParser implements Parser<TtpPath> {
  parse(text: string): MaybeParsed<TtpPath> {
    try {
      const lines = text.split("\n");
      const header = "BEGIN:ApplicationVersion=TomTom Positioning";
      if (!lines[0].startsWith(header)) {
        throw new Error("Invalid TTP format");
      }
      const ttpVersion = lines[0].slice(header.length + 1);
      if (ttpVersion !== supportedVersion) {
        throw new Error(
          `Unsupported TTP version: ${ttpVersion}, expected ${supportedVersion}`
        );
      }

      const incoming_points = this.parsePoints(lines, TtpPointType.Incoming);
      const outgoing_points = this.parsePoints(lines, TtpPointType.Outgoing);

      const { points, message } = this.selectPointsAndBuildMessage(
        incoming_points,
        outgoing_points
      );

      if (points.length === 0) {
        return Maybe.success({
          paths: [],
          message: { value: "No routes found in given TTP." },
        });
      }

      return Maybe.success({
        paths: [new TtpPath(points)],
        message: { value: message },
      });
    } catch (error: any) {
      return Maybe.failure({
        value: `Error parsing as TTP: ${error.message}`,
      });
    }
  }

  private parsePoints(lines: string[], type: TtpPointType): TtpPoint[] {
    const points: TtpPoint[] = [];
    let seenTimestaps = new Set<number>();
    lines.forEach((line) => {
      if (line.startsWith("#")) {
        return; // skip comments
      }
      const parts = line.split(",");
      const reception_timestamp = parseFloat(parts[0]);
      if (reception_timestamp === 0 || seenTimestaps.has(reception_timestamp)) {
        return;
      }
      if (parts[1] !== type) {
        return;
      }
      const lon = parts[3];
      const lat = parts[5];
      const heading = parts[9];
      const speed = parts[11];
      if (!lon || !lat || !speed || !heading) {
        seenTimestaps.add(reception_timestamp);
        return;
      }

      try {
        const point = new TtpPoint(
          type,
          parseFloat(lat),
          parseFloat(lon),
          parseFloat(speed).toFixed(2) as any as number,
          reception_timestamp,
          parseFloat(heading)
        );
        points.push(point);
        seenTimestaps.add(reception_timestamp);
      } catch (error: any) {
        console.error(`error parsing a TTP point: ${error}`);
        // Just continue.
      }
    });
    return points;
  }

  private selectPointsAndBuildMessage(
    incoming_points: TtpPoint[],
    outgoing_points: TtpPoint[]
  ): { points: TtpPoint[]; message: string } {
    if (incoming_points.length === 0) {
      return { points: outgoing_points, message: "TTP: outgoing locations" };
    } else if (outgoing_points.length === 0) {
      return { points: incoming_points, message: "TTP: incoming locations" };
    } else if (outgoing_points.length > incoming_points.length) {
      return { points: outgoing_points, message: "TTP: outgoing locations" };
    } else {
      return { points: incoming_points, message: "TTP: incoming locations" };
    }
  }
}
