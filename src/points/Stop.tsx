import { GeoPoint } from "../types/geo_types";
import { Marker, Popup, useMap } from "react-leaflet";
import PointPopup from "./PointPopup";
import L from "leaflet";
import { waypointIcon, evWaypointIcon } from "../icons";

export default function Stop({
  index,
  point,
  isChargingStation = false,
  onMarkerReady = () => {},
  onGoingForward = () => {},
  onGoingBackward = () => {},
  onClick = () => {},
}: {
  index: number;
  point: GeoPoint;
  isChargingStation: boolean;
  onMarkerReady?: (marker: L.Marker | null) => void;
  onGoingForward?: () => void;
  onGoingBackward?: () => void;
  onClick?: () => void;
}) {
  const map = useMap();

  return (
    <Marker
      ref={(r) => {
        onMarkerReady(r);
      }}
      position={[point.latitude, point.longitude]}
      icon={isChargingStation ? evWaypointIcon : waypointIcon}
      eventHandlers={{
        click: () => {
          onClick();
        },
      }}
    >
      <Popup>
        <PointPopup
          title={`${index}`}
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
