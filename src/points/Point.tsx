import { GeoPoint } from "../types/geo_types";
import { CircleMarker, Popup, useMap } from "react-leaflet";
import PointPopup from "./PointPopup";
import L from "leaflet";
import { tomtomPrimaryColor } from "../colors";

export default function Point({
  index,
  point,
  text = "",
  color = tomtomPrimaryColor,
  onMarkerReady = () => {},
  onClick = () => {},
  onGoingForward = () => {},
  onGoingBackward = () => {},
}: {
  index: number;
  point: GeoPoint;
  text?: string;
  color?: string;
  onMarkerReady?: (marker: L.CircleMarker | null) => void;
  onClick?: (index: number) => void;
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
          text={text !== "" ? text :`${point.latitude}, ${point.longitude}`}
          onLocateClick={() => {
            map?.flyTo([point.latitude, point.longitude], 18, {
              animate: true,
              duration: 0.25,
            });
          }}
          onLeftArrowClick={onGoingBackward}
          onRightArrowClick={onGoingForward}
        />
      </Popup>
    </CircleMarker>
  );
}
