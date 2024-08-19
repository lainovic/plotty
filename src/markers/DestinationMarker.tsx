import { GeoPoint } from "../types/geo_types";
import { Marker, Popup, useMap } from "react-leaflet";
import PointPopup from "./PointPopup";
import L from "leaflet";
import React from "react";
import { destinationIcon } from "../icons";

export default function DestinationMarker({
  point,
  isFocused = false,
}: {
  point: GeoPoint;
  isFocused?: boolean;
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
    <Marker
      position={[point.latitude, point.longitude]}
      icon={destinationIcon}
      eventHandlers={{
        click: (e) => {
          console.log("CircleMarker clicked", e);
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
          title="D"
          text={`${point.latitude}, ${point.longitude}`}
          handlePointClick={() => {
            map?.flyTo([point.latitude, point.longitude], 18, {
              animate: true,
              duration: 0.5,
            });
          }}
        />
      </Popup>
    </Marker>
  );
}
