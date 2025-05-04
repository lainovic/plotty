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
import { tomtomBlackColor } from "../../shared/colors";
import { RouteInstruction } from "../../domain/value-objects/RouteInstruction";

interface RouteComponentProps {
  route: Route;
  color: string;
}

const RoutePoints: React.FC<RouteComponentProps> = ({ route, color }) => {
  const points = route.points;

  const {
    handlePointClick,
    handleGoingForward: gotoNextPoint,
    handleGoingBackward: gotoPreviousPoint,
    handlePointReady,
  } = usePointFocus(points.length, `${route.id.toString()}_points`);

  return (
    <>
      {points.map((point, index) => (
        <Point
          key={index}
          title={`${index}`}
          point={point}
          onReady={(marker) => handlePointReady(index, marker)}
          onRight={gotoNextPoint}
          onLeft={gotoPreviousPoint}
          onClick={() => {
            handlePointClick(index);
          }}
          color={color}
        />
      ))}
    </>
  );
};

const RouteWaypoints: React.FC<RouteComponentProps> = ({ route }) => {
  const stops = route.stops;
  const waypoints = stops.slice(1, -1);
  const origin = stops[0];
  const destination = stops[stops.length - 1];

  const {
    handlePointClick,
    handleGoingForward: gotoNextPoint,
    handleGoingBackward: gotoPreviousPoint,
    handlePointReady,
  } = usePointFocus(stops.length, `${route.id.toString()}_waypoints`);

  return (
    <>
      <Origin
        key={0}
        point={origin}
        onReady={(marker) => {
          handlePointReady(0, marker);
        }}
        onRight={gotoNextPoint}
        onLeft={gotoPreviousPoint}
        onClick={() => {
          handlePointClick(0);
        }}
      />

      {waypoints.map((waypoint, index) => (
        <Stop
          key={index + 1}
          title={`${index + 1}`}
          point={new Coordinates(waypoint.latitude, waypoint.longitude)}
          isChargingStation={waypoint.isChargingStation}
          onReady={(marker) => {
            handlePointReady(index + 1, marker);
          }}
          onRight={gotoNextPoint}
          onLeft={gotoPreviousPoint}
          onClick={() => {
            handlePointClick(index + 1);
          }}
        />
      ))}

      <Destination
        key={stops.length - 1}
        point={destination}
        onReady={(marker) => {
          handlePointReady(stops.length - 1, marker);
        }}
        onRight={gotoNextPoint}
        onLeft={gotoPreviousPoint}
        onClick={() => {
          handlePointClick(stops.length - 1);
        }}
      />
    </>
  );
};

const RouteInstructions: React.FC<RouteComponentProps> = ({ route }) => {
  const instructions = route.instructions;

  const {
    handlePointClick,
    handleGoingForward: gotoNextPoint,
    handleGoingBackward: gotoPreviousPoint,
    handlePointReady,
  } = usePointFocus(instructions.length, `${route.id.toString()}_instructions`);

  return (
    <>
      {instructions.map((i, index) => {
        const { instruction: text, point } = i;
        return (
          <Point
            key={index}
            title={text}
            point={new Coordinates(point.latitude, point.longitude)}
            radius={12}
            content={<InstructionText instruction={i} />}
            onReady={(marker) => handlePointReady(index, marker)}
            onRight={gotoNextPoint}
            onLeft={gotoPreviousPoint}
            onClick={() => {
              handlePointClick(index);
            }}
            color={tomtomBlackColor}
          />
        );
      })}
    </>
  );
};

export const RouteLayer: React.FC<PathComponentProps<Route>> = React.memo(
  ({ layer }) => {
    const route = layer.getPath();
    const { setLayerGroup } = useLayerVisibility(layer);

    const props: RouteComponentProps = {
      route,
      color: layer.getColor().toHex(),
    };

    return (
      <LayerGroup
        ref={(r) => {
          if (r) setLayerGroup(r);
        }}
      >
        <RoutePoints {...props} />
        <RouteWaypoints {...props} />
        <RouteInstructions {...props} color={tomtomBlackColor} />
      </LayerGroup>
    );
  }
);

function InstructionText({ instruction }: { instruction: RouteInstruction }) {
  const { point } = instruction;
  return (
    <div style={styles.container}>
      {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};
