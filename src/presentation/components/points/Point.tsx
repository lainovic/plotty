import { CircleMarker, Popup, useMap } from "react-leaflet";
import PointPopup from "./PointPopup";
import L from "leaflet";
import { toast } from "react-toastify";
import { tomtomPrimaryColor } from "../../../shared/colors";
import { Coordinates } from "../../../domain/value-objects/Coordinates";

interface PointProps {
  point: Coordinates;
  title: string;
  content?: React.ReactNode;
  color?: string;
  radius?: number;
  highlighted?: boolean;
  onReady?: (marker: L.CircleMarker | null) => void;
  onPointClick?: () => void;
  onCopy?: () => void;
  onGoingForward?: () => void;
  onGoingBackward?: () => void;
}

export const Point: React.FC<PointProps> = ({
  point,
  title,
  content = null,
  color = tomtomPrimaryColor,
  radius = 4,
  highlighted = false,
  onReady = () => {},
  onPointClick = () => {},
  onCopy = () => {
    navigator.clipboard.writeText(
      `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`
    );
    toast.success("Coordiates copied to clipboard");
  },
  onGoingForward = () => {},
  onGoingBackward = () => {},
}) => {
  const map = useMap();

  const fillOpacity = highlighted ? 0.8 : 0.6;
  const actualRadius = highlighted ? radius * 1.3 : radius;
  const weight = highlighted ? 3 : 1;

  return (
    <CircleMarker
      ref={(r) => {
        if (r) onReady(r);
      }}
      center={[point.latitude, point.longitude]}
      radius={actualRadius}
      pathOptions={{
        color: color,
        fillOpacity: fillOpacity,
        weight: weight,
        fillColor: highlighted ? color : undefined,
      }}
      eventHandlers={{
        click: () => {
          onPointClick();
        },
      }}
      fillColor=""
    >
      <Popup>
        <PointPopup
          title={title}
          content={content ? content : `${point.latitude}, ${point.longitude}`}
          onLocateClick={() => {
            map?.flyTo([point.latitude, point.longitude], 18, {
              animate: true,
              duration: 0.25,
            });
          }}
          onLeftArrowClick={onGoingBackward}
          onRightArrowClick={onGoingForward}
          onCopyContentClick={onCopy}
        />
      </Popup>
    </CircleMarker>
  );
};
