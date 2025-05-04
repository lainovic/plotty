export interface RouteSource {
  legs: {
    encodedPolyline?: string;
    encodedPolylinePrecision?: number;
    points: {
      latitude: number;
      longitude: number;
    }[];
    summary: Summary;
  }[];
  summary: Summary;
  guidance: {
    instructions: GuidanceInstruction[];
  };
  progress: Progress[];
  sections: Section[];
}

export interface Summary {
  departureTime: string;
  arrivalTime: string;
  lengthInMeters: number;
  trafficDelayInSeconds: number;
  trafficLengthInMeters: number;
  travelTimeInSeconds: number;
  remainingChargeAtArrivalInkWh?: number;
  totalChargingTimeInSeconds?: number;
  chargingInformationAtEndOfLeg?: Record<string, unknown>;
}

interface GuidanceInstruction {
  drivingSide: string;
  maneuver: string;
  maneuverPoint: {
    latitude: number;
    longitude: number;
  };
  routeOffsetInMeters: number;
}

interface Progress {
  distanceInMeters: number;
  pointIndex: number;
  travelTimeInSeconds: number;
}

interface Section {
  delayInSeconds: number;
  effectiveSpeedInKmh: number;
  endPointIndex: number;
  magnitudeOfDelay: number;
  sectionType: string;
  simpleCategory: string;
  startPointIndex: number;
  tec: {
    effectCode: number;
    causes: {
      mainCauseCode: number;
    }[];
  };
}
