import { GeoPoint } from "../types/geo_types";
import { CircleMarker, Popup, useMap } from "react-leaflet";
import PointPopup from "./PointPopup";
import L from "leaflet";
import React from "react";
import { tomtomPrimaryColor } from "../colors";

export default function Point({
  index,
  point,
  isFocused = false,
  onClicked = () => {},
}: {
  index: number;
  point: GeoPoint;
  isFocused?: boolean;
  onClicked?: (index: number) => void;
}) {
  const [refReady, setRefReady] = React.useState(false);
  let popupRef = React.useRef<L.Popup | null>(null);
  const map = useMap();

  React.useEffect(() => {
    if (map && refReady && isFocused) {
      popupRef.current!.openOn(map);
    }
  }, [isFocused, refReady, map]);

  return (
    <CircleMarker
      center={[point.latitude, point.longitude]}
      radius={4}
      pathOptions={{ color: tomtomPrimaryColor }}
      eventHandlers={{
        click: () => {
          onClicked(index);
        },
      }}
    >
      <Popup
        ref={(r) => {
          popupRef.current = r;
          setRefReady(true);
        }}
      >
        <PointPopup
          title={`${index}`}
          text={`${point.latitude}, ${point.longitude}`}
          handlePointClick={() => {
            map?.flyTo([point.latitude, point.longitude], 18, {
              animate: true,
              duration: 0.5,
            });
          }}
        />
      </Popup>
    </CircleMarker>
  );
}
