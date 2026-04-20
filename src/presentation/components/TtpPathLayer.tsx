import React from "react";
import { LayerGroup } from "react-leaflet";
import { Point } from "./points/Point";
import { Origin } from "./points/Origin";
import { Destination } from "./points/Destination";
import { TtpPath } from "../../domain/entities/TtpPath";
import { usePointFocus } from "../hooks/usePointFocus";
import { TtpPoint, TtpPointType } from "../../domain/value-objects/TtpPoint";
import { PathComponentProps } from "../shared/PathComponentsProps";
import { CoordContent } from "./points/CoordContent";
import { CopyBtn } from "./points/CopyBtn";

export const TtpPathLayer: React.FC<PathComponentProps<TtpPath>> = ({
  layer,
}) => {
  const points = layer.path.points;
  const origin = points[0];
  const destination = points[points.length - 1];

  const {
    handlePointClick,
    handleGoingForward,
    handleGoingBackward,
    handlePointReady: setMarker,
    focusedPointIndex,
  } = usePointFocus(points.length, layer.id);

  return (
    <LayerGroup>
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
          key={`${index + 1}-${point.latitude},${point.longitude}`}
          title={`${index + 1}`}
          point={point}
          onReady={(marker) => {
            setMarker(index + 1, marker);
          }}
          content={<TtpText point={point} color={layer.color.toHex()} />}
          onRight={handleGoingForward}
          onLeft={handleGoingBackward}
          onClick={() => {
            handlePointClick(index + 1);
          }}
          highlighted={index + 1 === focusedPointIndex}
          color={layer.color.toHex()}
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

function TtpText({ point, color }: { point: TtpPoint; color: string }) {
  const isIncoming = point.type === TtpPointType.Incoming;
  const coords = `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`;
  return (
    <div style={styles.root}>
      <CoordContent lat={point.latitude} lng={point.longitude} accentColor={color} />
      <div style={styles.divider} />
      <div style={styles.grid}>
        <span style={styles.key}>type</span>
        <span style={{ ...styles.val, color: isIncoming ? "#2980b9" : "#e67e22", fontWeight: 600 }}>
          {isIncoming ? "incoming" : "outgoing"}
        </span>
        <span />
        {point.speed !== null && <>
          <span style={styles.key}>speed</span>
          <span style={styles.val}>{point.speed}</span>
          <CopyBtn value={String(point.speed)} label="copy speed" />
        </>}
        {point.heading !== null && <>
          <span style={styles.key}>heading</span>
          <span style={styles.val}>{point.heading?.toFixed(2)}°</span>
          <CopyBtn value={String(point.heading?.toFixed(2))} label="copy heading" />
        </>}
        <span style={styles.key}>coords</span>
        <span style={{ ...styles.val, fontFamily: "monospace", fontSize: "0.7rem" }}>{coords}</span>
        <CopyBtn value={coords} label="copy coordinates" />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  root: {
    display: "flex",
    flexDirection: "column",
    minWidth: "200px",
    gap: "5px",
  },
  divider: {
    height: "1px",
    background: "rgba(0,0,0,0.07)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: "4px 8px",
    alignItems: "center",
  },
  key: {
    fontSize: "0.7rem",
    color: "rgba(0,0,0,0.4)",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  val: {
    fontSize: "0.75rem",
    color: "rgba(0,0,0,0.8)",
  },
};
