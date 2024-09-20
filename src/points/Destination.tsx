import { GeoPoint } from "../types/geo_types";
import { Marker, Popup, useMap } from "react-leaflet";
import PointPopup from "./PointPopup";
import L from "leaflet";
import { destinationIcon } from "../icons";

export default function Destination({
  point,
  onMarkerReady = () => {},
  onDestinationClick = () => {},
  onGoingForward = () => {},
  onGoingBackward = () => {},
}: {
  point: GeoPoint;
  onMarkerReady?: (marker: L.Marker | null) => void;
  onDestinationClick?: () => void;
  onGoingForward?: () => void;
  onGoingBackward?: () => void;
}) {
  const map = useMap();

  return (
    <Marker
      ref={(r) => {
        onMarkerReady(r);
      }}
      position={[point.latitude, point.longitude]}
      icon={destinationIcon}
      eventHandlers={{
        click: () => {
          onDestinationClick();
        },
      }}
    >
      <Popup>
        <PointPopup
          title="D"
          content={`${point.latitude}, ${point.longitude}`}
          onLocateClick={() => {
            map?.flyTo([point.latitude, point.longitude], 18, {
              animate: true,
              duration: 0.5,
            });
          }}
          onLeftArrowClick={onGoingBackward}
          onRightArrowClick={onGoingForward}
        />
      </Popup>
    </Marker>
  );
}
