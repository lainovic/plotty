import { MaybeParsed, Parser } from "./Parser";
import { RoutePath } from "../types/route_types";
import { Maybe } from "../types/common";

const supportedVersion = "0.0.12";

/**
 * Parses a JSON string containing route data and returns the parsed routes.
 *
 * The parser expects the JSON to have a `formatVersion` field that matches the
 * `supportedJSONVersion` constant. If the version does not match, the parser
 * will return an empty array of routes along with a message indicating the
 * unsupported version.
 *
 * If the JSON contains a `routes` field that is an array, the parser will
 * return the routes. If the `routes` field is missing or not an array, the
 * parser will return an empty array of routes along with a message indicating
 * that no routes were found.
 *
 * If there is an error parsing the JSON, the parser will return a failure
 * result with the error message.
 *
 * @param text - The JSON string to parse.
 * @returns The parsed routes, or a failure result if there was an error.
 */
export default class RoutingResponseParser implements Parser<RoutePath[]> {
  parse(text: string): MaybeParsed<RoutePath[]> {
    try {
      const json = JSON.parse(text);
      if (!json) return Maybe.failure({ value: "Empty JSON" });

      const { formatVersion, routes } = json;

      if (formatVersion !== supportedVersion) {
        return Maybe.success({
          result: [],
          message: {
            value: `Unsupported JSON version: ${json.formatVersion}, expected ${supportedVersion}`,
          },
        });
      }

      if (routes && Array.isArray(routes)) {
        console.log(`>>> routes`, routes);
        return Maybe.success({
          result: routes.map((route) => new RoutePath(route)),
          message: { value: "Parsed JSON" },
        });
      } else {
        return Maybe.success({
          result: [],
          message: { value: "No routes found in JSON" },
        });
      }
    } catch (error: any) {
      return Maybe.failure({
        value: `Error parsing as JSON: ${error.message}`,
      });
    }
  }
}
