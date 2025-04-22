import { GeoPoint } from "../types/geo_types";
import { CircleMarker, Popup, useMap } from "react-leaflet";
import PointPopup from "./PointPopup";
import L from "leaflet";
import { toast } from "react-toastify";
import { tomtomPrimaryColor } from "../colors";

export default function Point({
  index,
  point,
  content = null,
  color = tomtomPrimaryColor,
  radius = 4,
  highlighted = false,
  onMarkerReady = () => {},
  onClick = () => {},
  onCopy = () => {
    navigator.clipboard.writeText(
      `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`
    );
    toast.success("Coordiates copied to clipboard");
  },
  onGoingForward = () => {},
  onGoingBackward = () => {},
}: {
  index: number;
  point: GeoPoint;
  content?: React.ReactNode;
  color?: string;
  radius?: number;
  highlighted?: boolean;
  onMarkerReady?: (marker: L.CircleMarker | null) => void;
  onClick?: (index: number) => void;
  onCopy?: () => void;
  onGoingForward?: () => void;
  onGoingBackward?: () => void;
}) {
  const map = useMap();

  const fillOpacity = highlighted ? 0.8 : 0.6;
  const actualRadius = highlighted ? radius * 1.3 : radius;
  const weight = highlighted ? 3 : 1;

  return (
    <CircleMarker
      ref={(r) => {
        onMarkerReady(r);
      }}
      center={[point.latitude, point.longitude]}
      radius={actualRadius}
      pathOptions={{
        color: color,
        fillOpacity: fillOpacity,
        weight: weight,
        fillColor: highlighted ? color : undefined,
      }}
      eventHandlers={{
        click: () => {
          onClick(index);
        },
      }}
      fillColor=""
    >
      <Popup>
        <PointPopup
          title={`${index}`}
          content={
            content
              ? content
              : `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`
          }
          onLocateClick={() => {
            map?.flyTo([point.latitude, point.longitude], 18, {
              animate: true,
              duration: 0.25,
            });
          }}
          onLeftArrowClick={onGoingBackward}
          onRightArrowClick={onGoingForward}
          onCopyContentClick={onCopy}
        />
      </Popup>
    </CircleMarker>
  );
}
