import React from "react";
import { LayerGroup } from "react-leaflet";
import { Point } from "./points/Point";
import { usePointFocus } from "../hooks/usePointFocus";
import { PathComponentProps } from "../shared/PathComponentsProps";
import { LogPath } from "../../domain/entities/LogPath";
import { LogPointPopup } from "./points/LogPointPopup";
import { LogPoint } from "../../domain/value-objects/LogPoint";
import { getLogTagColor } from "../utils/logTagColors";

const getPointStyle = (point: LogPoint) => {
  const { point: color, category } = getLogTagColor(point.tag);
  return {
    radius: category === "routing" ? 12 : 4,
    color,
  };
};

export const LogPathLayer: React.FC<PathComponentProps<LogPath>> = React.memo(
  ({ layer }) => {
    const points = layer.path.points;

    const {
      handlePointClick,
      handleGoingForward,
      handleGoingBackward,
      handlePointReady: setMarker,
      focusedPointIndex,
    } = usePointFocus(points.length, layer.id);

    return (
      <LayerGroup>
        {points.map((point, index) => {
          const style = getPointStyle(point);
          return (
            <Point
              key={point.line}
              title={`${point.line}`}
              point={point}
              highlighted={index === focusedPointIndex}
              radius={style.radius}
              color={style.color}
              showCopyButton={false}
              content={<LogPointPopup point={point} />}
              onReady={(marker) => setMarker(index, marker)}
              onRight={handleGoingForward}
              onLeft={handleGoingBackward}
              onClick={() => {
                handlePointClick(index);
              }}
            />
          );
        })}
      </LayerGroup>
    );
  }
);
