import L, { LatLng } from "leaflet";
import React from "react";
import { useMap } from "react-leaflet";
import { tomtomBlackColor } from "../../../shared/colors";

interface RulerProps {
  onDistanceChange: (distance: number, shouldCopy: boolean) => void;
}

// a Ruler class that is used to measure distances between points on the map.
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
            { color: tomtomBlackColor }
          ).addTo(layer.current);
          onDistanceChange(getDistance(polyline.current), false);
        })
        .on("dragend", () => {
          onDistanceChange(getDistance(polyline.current), true);
        })
        .addTo(layer.current)
    );

    if (markers.current.length === 1) {
      onDistanceChange(0, false);
    } else if (markers.current.length > 1) {
      layer.current.removeLayer(polyline.current);
      polyline.current = L.polyline(
        markers.current.map((marker) => marker.getLatLng()),
        { color: tomtomBlackColor }
      ).addTo(layer.current);
      onDistanceChange(getDistance(polyline.current), true);
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
      onDistanceChange(-1, false);
    };
  }, []);

  return null;
};

export default Ruler;
