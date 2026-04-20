import React from "react";
import { LayerGroup } from "react-leaflet";
import { Point } from "./points/Point";
import { usePointFocus } from "../hooks/usePointFocus";
import { PathComponentProps } from "../shared/PathComponentsProps";
import { LogPath } from "../../domain/entities/LogPath";
import { LogPointPopup } from "./points/LogPointPopup";
import { LogcatTagMatcher } from "../../domain/parsers/logcat/LogcatTagMatcher";
import {
  defaultColors,
  tomtomPrimaryColor,
  tomtomSecondaryColor,
} from "../../shared/colors";
import { LogPoint } from "../../domain/value-objects/LogPoint";

const getPointStyle = (point: LogPoint) => {
  const tag = point.tag;
  const isRoutePlanner = LogcatTagMatcher.isRoutePlanner(tag);
  const isMapMatcher = LogcatTagMatcher.isMapMatcher(tag);
  return {
    radius: isRoutePlanner ? 12 : isMapMatcher ? 4 : 4,
    color: isRoutePlanner
      ? tomtomSecondaryColor
      : isMapMatcher
      ? defaultColors[4]
      : tomtomPrimaryColor,
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
