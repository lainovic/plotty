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
  onMarkerReady?: (marker: L.CircleMarker | null) => void;
  onClick?: (index: number) => void;
  onCopy?: () => void;
  onGoingForward?: () => void;
  onGoingBackward?: () => void;
}) {
  const map = useMap();

  return (
    <CircleMarker
      ref={(r) => {
        onMarkerReady(r);
      }}
      center={[point.latitude, point.longitude]}
      radius={4}
      pathOptions={{ color: color }}
      eventHandlers={{
        click: () => {
          onClick(index);
        },
      }}
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
