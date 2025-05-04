import { Message } from "../../shared/Message";
import { Path } from "../entities/Path";
import GeoPointsParser from "../parsers/GeoPointsParser";
import RoutingResponseParser from "../parsers/RoutingResponseParser";
import TtpParser from "../parsers/TtpParser";
import { Coordinates } from "../value-objects/Coordinates";

interface parseTextProps {
  input: string;
  onSuccess: (message: Message) => void;
  onFailure: (message: Message) => void;
}

export function parseText<T extends Coordinates>({
  input,
  onSuccess,
  onFailure,
}: parseTextProps): Path<T>[] {
  if (input === "") {
    return [];
  }
  let parseSuccess = false;
  for (const parser of [
    new RoutingResponseParser(),
    new TtpParser(),
    new GeoPointsParser(),
  ]) {
    parser
      .parse(input)
      .ifSuccess((parsedPaths: ParseResult<Path<T>[]>) => {
        onSuccess({
          value: parsedPaths.message.value,
        });
        return parsedPaths.result;
      })
      .ifFailure((error) => {
        onFailure(error);
      });
  }
  if (!parseSuccess) {
    onFailure({ value: "Failed to parse input data" });
  }
  return [];
}
