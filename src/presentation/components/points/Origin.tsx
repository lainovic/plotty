import { Marker, Popup, useMap } from "react-leaflet";
import PointPopup from "./PointPopup";
import L from "leaflet";
import { Coordinates } from "../../../domain/value-objects/Coordinates";
import { originIcon } from "../../shared/icons";

interface OriginProps {
  point: Coordinates;
  onMarkerReady?: (marker: L.Marker | null) => void;
  onOriginClick?: () => void;
  onGoingForward?: () => void;
  onGoingBackward?: () => void;
}

export const Origin: React.FC<OriginProps> = ({
  point,
  onMarkerReady = () => {},
  onOriginClick = () => {},
  onGoingForward = () => {},
  onGoingBackward = () => {},
}) => {
  const map = useMap();

  return (
    <Marker
      ref={(r) => {
        onMarkerReady(r);
      }}
      position={[point.latitude, point.longitude]}
      icon={originIcon}
      eventHandlers={{
        click: () => {
          onOriginClick();
        },
      }}
    >
      <Popup>
        <PointPopup
          title="O"
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
