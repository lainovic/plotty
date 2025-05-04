import React from "react";
import { LayerGroup } from "react-leaflet";
import { Point } from "./points/Point";
import { Origin } from "./points/Origin";
import { Stop } from "./points/Stop";
import { Destination } from "./points/Destination";
import { Route } from "../../domain/entities/Route";
import { Coordinates } from "../../domain/value-objects/Coordinates";
import { usePointFocus } from "../hooks/usePointFocus";
import { useLayerVisibility } from "../hooks/useLayerVisibility";
import { PathComponentProps } from "../shared/PathComponentsProps";

export const RouteLayer: React.FC<PathComponentProps<Route>> = React.memo(
  ({ layer }) => {
    const route = layer.getPath();
    const points = route.points;
    const origin = points[0];
    const destination = points[points.length - 1];

    const { setLayerGroup } = useLayerVisibility(layer);

    const {
      handlePointClick,
      handleGoingForward,
      handleGoingBackward,
      setMarker,
    } = usePointFocus(points.length);

    return (
      <LayerGroup
        ref={(r) => {
          if (r) setLayerGroup(r);
        }}
      >
        {points.slice(1, -1).map((point, index) => (
          <Point
            key={index + 1}
            title={`${index + 1}`}
            point={point}
            onReady={(marker) => setMarker(index + 1, marker)}
            onGoingForward={handleGoingForward}
            onGoingBackward={handleGoingBackward}
            onPointClick={() => {
              handlePointClick(index + 1);
            }}
            color={layer.getColor().toHex()}
          />
        ))}
        {route.stops.map((stop, index) => (
          <Stop
            key={index}
            title={`${stop.index}`}
            point={new Coordinates(stop.latitude, stop.longitude)}
            isChargingStation={stop.isChargingStation}
            onGoingForward={handleGoingForward}
            onGoingBackward={handleGoingBackward}
            onStopClick={() => {
              handlePointClick(stop.index);
            }}
          />
        ))}
        <Origin
          key={0}
          point={origin}
          onMarkerReady={(marker) => {
            setMarker(0, marker);
          }}
          onGoingForward={handleGoingForward}
          onGoingBackward={handleGoingBackward}
          onOriginClick={() => {
            handlePointClick(0);
          }}
        />
        <Destination
          key={points.length - 1}
          point={destination}
          onMarkerReady={(marker) => {
            setMarker(points.length - 1, marker);
          }}
          onGoingForward={handleGoingForward}
          onGoingBackward={handleGoingBackward}
          onDestinationClick={() => {
            handlePointClick(points.length - 1);
          }}
        />
      </LayerGroup>
    );
  }
);
