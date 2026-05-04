import React from "react";
import { LayerGroup, Polyline, Polygon, Popup } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import { usePointFocus } from "../hooks/usePointFocus";
import { Point } from "./points/Point";
import { GeoPathPopup } from "./points/GeoPathPopup";
import { GeoPath } from "../../domain/entities/GeoPath";
import { PathComponentProps } from "../shared/PathComponentsProps";

export const GeoPathLayer: React.FC<PathComponentProps<GeoPath>> = React.memo(({
  layer,
}) => {
  const points = layer.path.points;
  const color = layer.color.toHex();
  const { renderHint } = layer.path;

  const {
    handlePointClick,
    handleGoingForward,
    handleGoingBackward,
    handlePointReady,
    focusedPointIndex,
  } = usePointFocus(points.length, layer.id);

  const positions = points.map((p) => [p.latitude, p.longitude] as [number, number]);
  const pathOptions = { color, weight: 2, opacity: 0.85 };
  const [popupPos, setPopupPos] = React.useState<[number, number] | null>(null);
  const hasProps = !!layer.path.properties;

  const onGeomClick = hasProps
    ? (e: LeafletMouseEvent) => setPopupPos([e.latlng.lat, e.latlng.lng])
    : undefined;

  return (
    <LayerGroup>
      {renderHint === "line" && (
        <Polyline positions={positions} pathOptions={pathOptions} eventHandlers={onGeomClick ? { click: onGeomClick } : undefined} />
      )}
      {renderHint === "polygon" && (
        <Polygon positions={positions} pathOptions={{ ...pathOptions, fillOpacity: 0.1 }} eventHandlers={onGeomClick ? { click: onGeomClick } : undefined} />
      )}
      {popupPos && layer.path.properties && (
        <Popup position={popupPos} eventHandlers={{ remove: () => setPopupPos(null) }}>
          <GeoPathPopup name={layer.path.getName()} properties={layer.path.properties} />
        </Popup>
      )}
      {points.map((point, index) => (
        <Point
          key={`${index}-${point.latitude},${point.longitude}`}
          title={`${index}`}
          point={point}
          onReady={(marker) => handlePointReady(index, marker)}
          onRight={handleGoingForward}
          onLeft={handleGoingBackward}
          onClick={() => handlePointClick(index)}
          highlighted={index === focusedPointIndex}
          color={color}
          radius={renderHint === "points" ? 8 : 5}
        />
      ))}
    </LayerGroup>
  );
});
