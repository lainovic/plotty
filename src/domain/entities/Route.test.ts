import { describe, expect, it } from "vitest";
import { Route } from "./Route";
import { RouteSource } from "../value-objects/RoutingModel";

const summary = {
  departureTime: "2024-01-01T00:00:00Z",
  arrivalTime: "2024-01-01T01:00:00Z",
  lengthInMeters: 10000,
  trafficDelayInSeconds: 0,
  trafficLengthInMeters: 0,
  travelTimeInSeconds: 3600,
};

describe("Route", () => {
  it("maps intermediate stops to the correct point index", () => {
    const source: RouteSource = {
      legs: [
        {
          points: [
            { latitude: 10, longitude: 10 },
            { latitude: 20, longitude: 20 },
          ],
          summary,
        },
        {
          points: [
            { latitude: 20, longitude: 20 },
            { latitude: 20, longitude: 30 },
          ],
          summary,
        },
        {
          points: [
            { latitude: 20, longitude: 30 },
            { latitude: 30, longitude: 30 },
          ],
          summary,
        },
      ],
      summary,
      guidance: { instructions: [] },
      progress: [],
      sections: [],
    };

    const route = new Route(source);

    expect(route.stops.map((stop) => stop.index)).toEqual([0, 1, 2, 3]);
  });
});
