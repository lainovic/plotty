import React from "react";
import { LayerGroup } from "react-leaflet";
import { Point } from "./points/Point";
import { Origin } from "./points/Origin";
import { Destination } from "./points/Destination";
import { TtpPath } from "../../domain/entities/TtpPath";
import { useLayerVisibility } from "../hooks/useLayerVisibility";
import { usePointFocus } from "../hooks/usePointFocus";
import { TtpPoint } from "../../domain/value-objects/TtpPoint";
import { PathComponentProps } from "../shared/PathComponentsProps";

export const TtpPathLayer: React.FC<PathComponentProps<TtpPath>> = ({
  layer,
}) => {
  const ttpPath = layer.getPath();
  const points = ttpPath.points;
  const origin = points[0];
  const destination = points[points.length - 1];

  const { setLayerGroup } = useLayerVisibility(layer);

  const {
    handlePointClick,
    handleGoingForward,
    handleGoingBackward,
    handlePointReady: setMarker,
  } = usePointFocus(points.length, layer.id.toString());

  return (
    <LayerGroup
      ref={(r) => {
        if (r) setLayerGroup(r);
      }}
    >
      <Origin
        key={0}
        point={origin}
        onReady={(marker) => {
          setMarker(0, marker);
        }}
        onRight={handleGoingForward}
        onLeft={handleGoingBackward}
        onClick={() => {
          handlePointClick(0);
        }}
      />

      {points.slice(1, -1).map((point, index) => (
        <Point
          key={index + 1}
          title={`${index + 1}`}
          point={point}
          onReady={(marker) => {
            setMarker(index + 1, marker);
          }}
          content={<TtpText point={point} />}
          onRight={handleGoingForward}
          onLeft={handleGoingBackward}
          onClick={() => {
            handlePointClick(index + 1);
          }}
          color={layer.getColor().toHex()}
          radius={8}
        />
      ))}

      <Destination
        key={points.length - 1}
        point={destination}
        onReady={(marker) => {
          setMarker(points.length - 1, marker);
        }}
        onRight={handleGoingForward}
        onLeft={handleGoingBackward}
        onClick={() => {
          handlePointClick(points.length - 1);
        }}
      />
    </LayerGroup>
  );
};

function TtpText({ point }: { point: TtpPoint }) {
  return (
    <div style={styles.container}>
      {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}
      <br />
      Speed: {point.speed}
      <br />
      Heading: {point.heading?.toFixed(2)}
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
