import L, { LatLng } from "leaflet";
import React from "react";
import { useMap } from "react-leaflet";
import { tomtomBlackColor } from "../../../shared/colors";

interface RulerProps {
  onDistanceChange: (distance: number, shouldCopy: boolean) => void;
}

const Ruler: React.FC<RulerProps> = ({ onDistanceChange }) => {
  const [point, setPoint] = React.useState<LatLng | null>(null);
  const layer = React.useRef<L.LayerGroup>(L.layerGroup());
  const polyline = React.useRef<L.Polyline>(L.polyline([]));
  const markers = React.useRef<L.Marker[]>([]);
  const map = useMap();

  const icon = L.divIcon({ className: "leaflet-ruler-marker" });

  React.useEffect(() => {
    map.addLayer(layer.current);
    const container = map.getContainer();
    const prevCursor = container.style.cursor;
    container.style.cursor = "crosshair";

    const handleMapClick = (e: L.LeafletMouseEvent) => setPoint(e.latlng);
    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
      layer.current.clearLayers();
      map.removeLayer(layer.current);
      container.style.cursor = prevCursor;
      onDistanceChange(-1, false);
    };
  }, []);

  React.useEffect(() => {
    if (point === null) return;

    markers.current.push(
      L.marker(point, { icon, draggable: true })
        .on("drag", () => {
          layer.current.removeLayer(polyline.current);
          polyline.current = L.polyline(
            markers.current.map((m) => m.getLatLng()),
            { color: tomtomBlackColor }
          ).addTo(layer.current);
          onDistanceChange(getDistance(polyline.current), false);
        })
        .on("dragend", () => {
          onDistanceChange(getDistance(polyline.current), true);
        })
        .addTo(layer.current)
    );

    if (markers.current.length > 1) {
      layer.current.removeLayer(polyline.current);
      polyline.current = L.polyline(
        markers.current.map((m) => m.getLatLng()),
        { color: tomtomBlackColor }
      ).addTo(layer.current);
      onDistanceChange(getDistance(polyline.current), true);
    }
  }, [point]);

  function getDistance(polyline: L.Polyline): number {
    const latLngs = polyline.getLatLngs();
    let total = 0;
    for (let i = 0; i < latLngs.length - 1; i++) {
      total += map.distance(latLngs[i] as LatLng, latLngs[i + 1] as LatLng);
    }
    return total;
  }

  return null;
};

export default Ruler;
