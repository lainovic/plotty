import React from "react";
import { CircleMarker, Popup, useMap } from "react-leaflet";
import PointPopup from "./PointPopup";
import L from "leaflet";
import { toast } from "react-toastify";
import { tomtomPrimaryColor } from "../../../shared/colors";
import { Coordinates } from "../../../domain/value-objects/Coordinates";

interface PointProps {
  point: Coordinates;
  title: string;
  content?: React.ReactNode;
  color?: string;
  radius?: number;
  highlighted?: boolean;
  fillOpacity?: number;
  onReady?: (marker: L.CircleMarker | null) => void;
  onClick?: () => void;
  onCopy?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
}

function arePropsEqual(prev: PointProps, next: PointProps): boolean {
  return (
    prev.point === next.point &&
    prev.color === next.color &&
    prev.radius === next.radius &&
    prev.highlighted === next.highlighted &&
    prev.fillOpacity === next.fillOpacity &&
    prev.title === next.title &&
    prev.content === next.content
  );
}

export const Point: React.FC<PointProps> = React.memo(({
  point,
  title,
  content = null,
  color = tomtomPrimaryColor,
  radius = 4,
  highlighted = false,
  fillOpacity = 0.6,
  onReady = () => {},
  onClick = () => {},
  onCopy = () => {
    navigator.clipboard.writeText(
      `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`
    );
    toast.success("Coordiates copied to clipboard");
  },
  onLeft = () => {},
  onRight = () => {},
}) => {
  const map = useMap();

  const actualOpacity = highlighted ? fillOpacity + 0.2 : fillOpacity;
  const actualRadius = highlighted ? radius * 1.3 : radius;
  const actualColor = highlighted ? color : undefined;
  const actualWeight = highlighted ? 3 : 1;

  return (
    <CircleMarker
      ref={(r) => {
        if (r) onReady(r);
      }}
      center={[point.latitude, point.longitude]}
      radius={actualRadius}
      pathOptions={{
        color: color,
        fillOpacity: actualOpacity,
        fillColor: actualColor,
        weight: actualWeight,
      }}
      eventHandlers={{
        click: () => {
          onClick();
        },
      }}
      fillColor=""
    >
      <Popup>
        <PointPopup
          title={title}
          content={content ? content : `${point.latitude}, ${point.longitude}`}
          onLocateClick={() => {
            map?.flyTo([point.latitude, point.longitude], 18, {
              animate: true,
              duration: 0.25,
            });
          }}
          onLeftArrowClick={onLeft}
          onRightArrowClick={onRight}
          onCopyContentClick={onCopy}
        />
      </Popup>
    </CircleMarker>
  );
}, arePropsEqual);
