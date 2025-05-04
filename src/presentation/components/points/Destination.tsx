import { Marker, Popup, useMap } from "react-leaflet";
import PointPopup from "./PointPopup";
import L from "leaflet";
import { Coordinates } from "../../../domain/value-objects/Coordinates";
import { destinationIcon } from "../../shared/icons";

interface DestinationProps {
  point: Coordinates;
  onReady?: (marker: L.Marker | null) => void;
  onClick?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
}

export const Destination: React.FC<DestinationProps> = ({
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
      icon={destinationIcon}
      eventHandlers={{
        click: () => {
          onClick();
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
          onLeftArrowClick={onLeft}
          onRightArrowClick={onRight}
        />
      </Popup>
    </Marker>
  );
};
