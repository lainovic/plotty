import React from "react";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import TileProviderSelector from "./providers/TileProviderSelector";

import { TileProvider } from "./providers/TileProvider";
import { filter, Path, RoutePath } from "./types/paths";
import { openStreetMapTileProvider } from "./providers/const";
import RouteLayer from "./layers/RouteLayer";
import { tomtomPrimaryColor } from "./colors";
import Checkbox from "@mui/material/Checkbox";
import { IconButton } from "@mui/material";
import AdsClickIcon from "@mui/icons-material/AdsClick";

function MapPlaceholder() {
  return (
    <p>
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

let colorCounter = 0;
const routeColors = [
  tomtomPrimaryColor,
  "#FF9E80",
  "#FF80AB",
  "#EA80FC",
  "#B388FF",
  "#8C9EFF",
  "#82B1FF",
  "#80D8FF",
  "#84FFFF",
  "#A7FFEB",
];

function increaseColorCounter() {
  colorCounter = (colorCounter + 1) % routeColors.length;
}

function getNewColor() {
  const currentColor = routeColors[colorCounter];
  increaseColorCounter();
  return currentColor;
}

/**
 * Renders a map view with provided paths.
 *
 * @param {Object} paths - The paths to render on the map.
 * @returns A React component that renders the map view.
 */
export default function MapComponent({ paths }: { paths: Path[] }) {
  const map = React.useRef<L.Map | null>(null);
  const [tileProvider, setTileProvider] = React.useState<TileProvider>(
    openStreetMapTileProvider
  );

  const layerGroups = React.useRef<Map<number, L.LayerGroup | null>>(new Map());
  const setLayerGroup = React.useCallback(
    (index: number, group: L.LayerGroup | null) => {
      layerGroups.current.set(index, group);
    },
    []
  );

  console.log(">>> rendering MapComponent");

  const visibility = React.useRef<Map<number, boolean>>(new Map());
  paths.forEach((_, index) => {
    if (!visibility.current.has(index)) {
      visibility.current.set(index, true);
    }
  });

  const toggleVisibility = (index: number) => {
    const newVisibility = !visibility.current.get(index);
    if (map.current) {
      if (newVisibility) {
        layerGroups.current.get(index)!.addTo(map.current);
      } else {
        layerGroups.current.get(index)!.removeFrom(map.current);
      }
    }
    visibility.current.set(index, newVisibility);
  };

  /**
   * Calculates the bounding box of the path and flies the map to that bounding box,
   * centering and zooming the map to fit the path.
   *
   * @param path - The path that was clicked.
   */
  function zoomToBoundingBox(path: Path) {
    if (path.empty()) return;
    const { minLatitude, maxLatitude, minLongitude, maxLongitude } =
      getBoundingBox(path);
    if (map.current) {
      map.current.fitBounds([
        [minLatitude, minLongitude],
        [maxLatitude, maxLongitude],
      ]);
    }
  }

  const RouteLayers: React.FC<{ paths: Path[] }> = React.memo(({ paths }) => {
    console.log(">>> rendering RouteLayers");
    const routePaths = filter<RoutePath>(paths, RoutePath);
    return (
      <>
        {routePaths.map(
          (path, index) =>
            path.isNotEmpty() && (
              <RouteLayer
                key={path.name}
                path={path}
                onLayerReady={(group) => {
                  setLayerGroup(index, group);
                }}
                color={getNewColor()}
              />
            )
        )}
      </>
    );
  });

  console.log(">>> rendering MapComponent");
  return (
    <>
      <TileProviderSelector
        onTileProviderChanged={(tileProvider) => {
          setTileProvider(tileProvider);
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MapContainer
          center={[44.7866, 20.4489]} // Belgrade
          zoom={11}
          minZoom={0}
          maxZoom={18}
          style={{ height: "90vh" }}
          scrollWheelZoom
          ref={(r) => {
            map.current = r;
          }}
          placeholder={<MapPlaceholder />}
        >
          <TileLayer
            attribution={tileProvider.getAttribution()}
            url={tileProvider.getUrl()}
          />
          <RouteLayers paths={paths} />
        </MapContainer>
        <LayerPanel
          paths={paths}
          onView={(path) => zoomToBoundingBox(path)}
          initialVisibility={visibility.current}
          onVisibilityChange={toggleVisibility}
        />
      </div>
    </>
  );
}

const LayerPanel: React.FC<{
  paths: Path[];
  initialVisibility: Map<number, boolean>;
  onVisibilityChange: (index: number) => void;
  onView: (path: Path) => void;
}> = ({ paths, initialVisibility, onVisibilityChange, onView }) => {
  // TODO current hack before trying external state management
  const [visibility, setVisibility] = React.useState<Map<number, boolean>>(
    new Map()
  );
  paths.forEach((_, index) =>
    visibility.set(index, initialVisibility.get(index) || false)
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "10px",
        border: "1px solid #ccc",
      }}
    >
      <h3>Layers</h3>
      {paths.map((path, index) => (
        <LayerCheckbox
          key={path.name}
          index={index}
          checked={visibility.get(index) || false}
          onChange={() => {
            onVisibilityChange(index);
            setVisibility((prev) => {
              const newVisibility = new Map(prev);
              newVisibility.set(index, !newVisibility.get(index));
              return newVisibility;
            });
          }}
          name={path.name}
          onView={() => onView(path)}
        />
      ))}
    </div>
  );
};

interface CheckboxProps {
  index: number;
  name: string;
  checked: boolean;
  onChange: (index: number) => void;
  onView: () => void;
}

const LayerCheckbox: React.FC<CheckboxProps> = ({
  index,
  name,
  checked,
  onChange,
  onView,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        margin: "5px 0",
        border: "1px solid #ccc",
      }}
    >
      <Checkbox
        checked={checked}
        onChange={() => onChange(index)}
        inputProps={{ "aria-label": "controlled" }}
      />
      {name}
      {/* <button onClick={onView}>Overview</button> */}
      <IconButton aria-label="center" onClick={onView}>
        <AdsClickIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

// function PointLayers({
//   layers,
//   focusedIndex,
//   onPointClicked,
// }: {
//   layers: Layer[];
//   focusedIndex?: number | null;
//   onPointClicked?: (index: number) => void;
// }) {
//   return (
//     <>
//       {layers.map((layer) => (
//         <>
//           {layer.shouldRender() && (
//             <RouteLayer
//               key={layer.name}
//               path={layer.path}
//               onPointClicked={onPointClicked}
//             />
//           )}
//         </>
//       ))}
//     </>
//   );
// }

/**
 * The bounding box of a geographic area,
 * used to define the visible area of a map, for purposes such as
 * centering the map.
 */
type BoundingBox = {
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
};

/**
 * Calculates the bounding box for the given path.
 *
 * @param path - The path to calculate the bounding box for.
 * @returns The bounding box for the path, or `null` if the path is empty.
 */
function getBoundingBox(path: Path): BoundingBox {
  const latitudes = path.points.map((point) => point.latitude);
  const longitudes = path.points.map((point) => point.longitude);

  const boundingBox = {
    minLatitude: Math.min(...latitudes),
    maxLatitude: Math.max(...latitudes),
    minLongitude: Math.min(...longitudes),
    maxLongitude: Math.max(...longitudes),
  };

  return boundingBox;
}
