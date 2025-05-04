import { Marker, Popup, useMap } from "react-leaflet";
import PointPopup from "./PointPopup";
import L from "leaflet";
import { Coordinates } from "../../../domain/value-objects/Coordinates";
import { originIcon } from "../../shared/icons";

interface OriginProps {
  point: Coordinates;
  onReady?: (marker: L.Marker | null) => void;
  onClick?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
}

export const Origin: React.FC<OriginProps> = ({
  point,
  onReady = () => {},
  onClick = () => {},
  onLeft = () => {},
  onRight = () => {},
}) => {
  const map = useMap();

  return (
    <Marker
      ref={(r) => {
        onReady(r);
      }}
      position={[point.latitude, point.longitude]}
      icon={originIcon}
      eventHandlers={{
        click: () => {
          onClick();
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
          onLeftArrowClick={onLeft}
          onRightArrowClick={onRight}
        />
      </Popup>
    </Marker>
  );
};
