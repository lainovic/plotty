import { LayerGroup, useMap } from "react-leaflet";
import { Path } from "../types/paths";
import Point from "../markers/Point";
import OriginMarker from "../markers/OriginMarker";
import DestinationMarker from "../markers/DestinationMarker";
import React from "react";

export default function RouteLayer({
  path,
}: {
  path: Path;
  onPointClicked?: (index: number) => void;
}) {
  const map = useMap();

  const origin = path.points[0];
  const destination = path.points[path.points.length - 1];

  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);

  const increaseFocusedMarkerIndex = React.useCallback(() => {
    setFocusedIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % path.points.length;
    });
  }, [path]);

  const decreaseFocusedMarkerIndex = React.useCallback(() => {
    setFocusedIndex((prev) => {
      const length = path.points.length;
      if (prev === null) return length - 1;
      return (prev - 1 + length) % length;
    });
  }, [path]);

  React.useEffect(() => {
    if (focusedIndex !== null && path.isNotEmpty()) {
      const { latitude, longitude } = path.points[focusedIndex];
      map.setView([latitude, longitude]);
    }
  }, [focusedIndex, path]);

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "h" || event.key === "H") {
        decreaseFocusedMarkerIndex();
      } else if (event.key === "l" || event.key === "L") {
        increaseFocusedMarkerIndex();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [increaseFocusedMarkerIndex, decreaseFocusedMarkerIndex]);

  return (
    <LayerGroup>
      {path.points.slice(1, -1).map((point, index) => (
        <Point
          index={index + 1} // adjust index to match the original array
          key={index + 1}
          point={point}
          isFocused={focusedIndex === index + 1}
          onClicked={(idx) => {
            setFocusedIndex(idx);
            const map = useMap();
            map.flyTo([point.latitude, point.longitude], 18, {
              animate: true,
              duration: 0.5,
            });
          }}
        />
      ))}
      <OriginMarker key={0} point={origin} isFocused={focusedIndex === 0} />
      <DestinationMarker
        key={path.points.length - 1}
        point={destination}
        isFocused={focusedIndex === path.points.length - 1}
      />
    </LayerGroup>
  );
}
