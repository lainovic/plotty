import { Marker, Popup, useMap } from "react-leaflet";
import PointPopup from "./PointPopup";
import L from "leaflet";
import { Coordinates } from "../../../domain/value-objects/Coordinates";
import { evWaypointIcon, waypointIcon } from "../../shared/icons";

interface StopProps {
  title: string;
  point: Coordinates;
  isChargingStation: boolean;
  onMarkerReady?: (marker: L.Marker | null) => void;
  onGoingForward?: () => void;
  onGoingBackward?: () => void;
  onStopClick?: () => void;
}

export const Stop: React.FC<StopProps> = ({
  title,
  point,
  isChargingStation = false,
  onMarkerReady = () => {},
  onGoingForward = () => {},
  onGoingBackward = () => {},
  onStopClick = () => {},
}) => {
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
          onStopClick();
        },
      }}
    >
      <Popup>
        <PointPopup
          title={title}
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
};
