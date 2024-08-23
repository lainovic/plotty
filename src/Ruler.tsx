// a Ruler class that is used to measure distances between points on the map.

import L, { LatLng } from "leaflet";
import React from "react";
import { useMap } from "react-leaflet";
import { tomtomSecondaryColor } from "./colors";

interface RulerProps {
  onDistanceChange: (distance: number) => void;
}

const Ruler: React.FC<RulerProps> = ({ onDistanceChange }) => {
  const [point, setPoint] = React.useState<LatLng | null>(null);

  const layer = React.useRef<L.LayerGroup>(L.layerGroup());
  const polyline = React.useRef<L.Polyline>(L.polyline([]));
  const markers = React.useRef<L.Marker[]>([]);
  const map = useMap();
  map.addLayer(layer.current);

  const icon = L.divIcon({ className: "leaflet-ruler-marker" });

  React.useEffect(() => {
    if (point === null) {
      return;
    }

    markers.current.push(
      L.marker(point, { icon, draggable: true })
        .on("drag", () => {
          layer.current.removeLayer(polyline.current);
          polyline.current = L.polyline(
            markers.current.map((marker) => marker.getLatLng()),
            {
              color: tomtomSecondaryColor,
            }
          ).addTo(layer.current); // add polyline to map
          onDistanceChange(getDistance(polyline.current));
        })
        .addTo(layer.current) // add marker to map
    );

    if (markers.current.length === 1) {
      onDistanceChange(0);
    } else if (markers.current.length > 1) {
      layer.current.removeLayer(polyline.current);
      polyline.current = L.polyline(
        markers.current.map((marker) => marker.getLatLng()),
        {
          color: tomtomSecondaryColor,
        }
      ).addTo(layer.current);
      onDistanceChange(getDistance(polyline.current));
    }
  }, [point]);

  function getDistance(polyline: L.Polyline): number {
    const latLngs = polyline.getLatLngs();
    let totalDistance = 0;
    for (let i = 0; i < latLngs.length - 1; i++) {
      totalDistance += map.distance(
        latLngs[i] as LatLng,
        latLngs[i + 1] as LatLng
      );
    }
    return totalDistance;
  }

  React.useEffect(() => {
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      setPoint(e.latlng);
    };

    map.on("click", handleMapClick);
    return () => {
      map.off("click", handleMapClick);
      layer.current.clearLayers();
      onDistanceChange(-1);
    };
  }, []);

  return null;
};

export default Ruler;
