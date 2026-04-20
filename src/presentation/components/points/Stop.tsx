import { Marker, Popup, useMap } from "react-leaflet";
import PointPopup from "./PointPopup";
import { CoordContent } from "./CoordContent";
import L from "leaflet";
import { Coordinates } from "../../../domain/value-objects/Coordinates";
import { evWaypointIcon, waypointIcon } from "../../shared/icons";

interface StopProps {
  title: string;
  point: Coordinates;
  isChargingStation: boolean;
  onReady?: (marker: L.Marker | null) => void;
  onLeft?: () => void;
  onRight?: () => void;
  onClick?: () => void;
}

export const Stop: React.FC<StopProps> = ({
  title,
  point,
  isChargingStation = false,
  onReady = () => {},
  onLeft = () => {},
  onRight = () => {},
  onClick = () => {},
}) => {
  const map = useMap();

  return (
    <Marker
      ref={(r) => {
        onReady(r);
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
          title={title}
          content={<CoordContent lat={point.latitude} lng={point.longitude} label={isChargingStation ? "Charging stop" : "Waypoint"} accentColor={isChargingStation ? "#27ae60" : "#e67e22"} />}
          onLocateClick={() => {
            map?.flyTo([point.latitude, point.longitude], 18, {
              animate: true,
              duration: 0.5,
            });
          }}
          onLeftArrowClick={onLeft}
          onRightArrowClick={onRight}
        />
      </Popup>
    </Marker>
  );
};
