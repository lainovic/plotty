import React from "react";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import TileProviderSelector from "./providers/TileProviderSelector";

import { TileProvider } from "./providers/TileProvider";
import { filter, GeoPath, Path, RoutePath } from "./types/paths";
import { openStreetMapTileProvider } from "./providers/const";
import RouteLayer from "./layers/RouteLayer";
import { tomtomPrimaryColor } from "./colors";
import LayerPanel from "./LayerPanel";
import { getBoundingBox } from "./utils";
import GeoLayer from "./layers/GeoLayer";

function MapPlaceholder() {
  return (
    <p>
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

let colorCounter = 0;
const layerColors = [
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
  colorCounter = (colorCounter + 1) % layerColors.length;
}

function resetColorCounter() {
  colorCounter = 0;
}

function getNewColor() {
  const currentColor = layerColors[colorCounter];
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
    console.log(">>> rendering route layers");
    return paths.map(
      (path, index) =>
        path.isNotEmpty() &&
        path instanceof RoutePath && (
          <RouteLayer
            key={path.name}
            path={path}
            onLayerReady={(group) => {
              setLayerGroup(index, group);
            }}
            color={getNewColor()}
          />
        )
    );
  });

  const PointLayers: React.FC<{ paths: Path[] }> = React.memo(({ paths }) => {
    console.log(">>> rendering geo layers");
    return paths.map(
      (path, index) =>
        path.isNotEmpty() &&
        path instanceof GeoPath && (
          <GeoLayer
            key={path.name}
            path={path}
            onLayerReady={(group) => {
              setLayerGroup(index, group);
            }}
            color={getNewColor()}
          />
        )
    );
  });

  console.log(">>> rendering map");

  resetColorCounter();

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
          <PointLayers paths={paths} />
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
