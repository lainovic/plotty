import React from "react";
import { LayerGroup } from "react-leaflet";
import { Point } from "./points/Point";
import { usePointFocus } from "../hooks/usePointFocus";
import { useLayerVisibility } from "../hooks/useLayerVisibility";
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
    const logPath = layer.getPath();
    const points = logPath.points;

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
        {points.map((point, index) => {
          const style = getPointStyle(point);
          return (
            <Point
              key={index}
              title={`${point.line}`}
              point={point}
              radius={style.radius}
              color={style.color}
              content={<LogPointPopup point={point} />}
              onReady={(marker) => setMarker(index, marker)}
              onGoingForward={handleGoingForward}
              onGoingBackward={handleGoingBackward}
              onPointClick={() => {
                handlePointClick(index);
              }}
            />
          );
        })}
      </LayerGroup>
    );
  }
);
