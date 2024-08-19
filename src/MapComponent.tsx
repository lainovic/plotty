import React from "react";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import TileProviderSelector from "./providers/TileProviderSelector";

import { TileProvider } from "./providers/TileProvider";
import { Path, RoutePath, GeoPath, TtpPath, LogcatPath } from "./types/paths";
import { openStreetMapTileProvider } from "./providers/const";
import { pathsToLayers } from "./layers/layer_utils";
import Layer from "./layers/model/Layer";
import RouteLayer from "./layers/RouteLayer";

function MapPlaceholder() {
  return (
    <p>
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

/**
 * Renders a map view with provided paths.
 *
 * @param {Object} paths - The paths to render on the map.
 * @returns A React component that renders the map view.
 */
export default function MapComponent({ paths }: { paths: Path[] }) {
  const [map, setMap] = React.useState<L.Map | null>(null);
  const [tileProvider, setTileProvider] = React.useState<TileProvider>(
    openStreetMapTileProvider
  );
  const [focusedMarkerIndex, setFocusedMarkerIndex] = React.useState<
    number | null
  >(null);
  const [focusedLayer, setFocusedLayer] = React.useState<Layer | null>(null);

  const routeLayers = React.useMemo(() => {
    const result = pathsToLayers(paths, RoutePath);
    console.log("routeLayers", result);
    return result;
  }, [paths]);

  const geoPathLayers = React.useMemo(() => {
    const result = pathsToLayers(paths, GeoPath);
    console.log("geoPathLayers", result);
    return result;
  }, [paths]);

  const ttpPathLayers = React.useMemo(
    () => pathsToLayers(paths, TtpPath),
    [paths]
  );

  const logcatPathLayers = React.useMemo(
    () => pathsToLayers(paths, LogcatPath),
    [paths]
  );

  const layers = React.useMemo(() => {
    console.log("layers calculated");
    return [
      ...routeLayers,
      ...geoPathLayers,
      ...ttpPathLayers,
      ...logcatPathLayers,
    ];
  }, [routeLayers, geoPathLayers, ttpPathLayers, logcatPathLayers]);

  const [visibility, setVisibility] = React.useState(() => {
    const initialVisibility = new Map<Layer, boolean>();
    layers.forEach((layer) => initialVisibility.set(layer, true));
    return initialVisibility;
  });

  console.log("visibilities", visibility);

  const toggleVisibility = (layer: Layer) => {
    setVisibility((prev) => {
      const newVisibility = new Map(prev);
      newVisibility.set(layer, !newVisibility.get(layer));
      return newVisibility;
    });
  };

  React.useEffect(() => {
    const initialVisibility = new Map<Layer, boolean>();
    layers.forEach((layer) => initialVisibility.set(layer, true));
    setVisibility(initialVisibility);
  }, [layers]);

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
    map?.fitBounds([
      [minLatitude, minLongitude],
      [maxLatitude, maxLongitude],
    ]);
  }

  const increaseFocusedMarkerIndex = React.useCallback(() => {
    if (focusedLayer === null) {
      console.log("focusedLayer is null");
      return;
    }
    setFocusedMarkerIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % focusedLayer.path.points.length;
    });
  }, [focusedLayer]);

  const decreaseFocusedMarkerIndex = React.useCallback(() => {
    if (focusedLayer === null) {
      console.log("focusedLayer is null");
      return;
    }
    setFocusedMarkerIndex((prev) => {
      const length = focusedLayer.path.points.length;
      if (prev === null) return length - 1;
      return (prev - 1 + length) % length;
    });
  }, [focusedLayer]);

  /**
   * When the focused layer or marker index changes,
   * update the map view to focus on the new marker.
   */
  React.useEffect(() => {
    if (map && focusedLayer && focusedMarkerIndex) {
      const { latitude, longitude } =
        focusedLayer.path.points[focusedMarkerIndex];
      map.flyTo([latitude, longitude]);
    }
  }, [focusedMarkerIndex]);

  /**
   * Listen for key presses to increase or decrease the focused marker index.
   */
  // React.useEffect(() => {
  //   const handleKeyPress = (event: KeyboardEvent) => {
  //     if (event.key === "h" || event.key === "H") {
  //       decreaseFocusedMarkerIndex();
  //     } else if (event.key === "l" || event.key === "L") {
  //       increaseFocusedMarkerIndex();
  //     } else if (event.key === "r" || event.key === "R") {
  //       // TODO enter Ruler mode
  //     }
  //   };
  //   document.addEventListener("keydown", handleKeyPress);
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyPress);
  //   };
  // }, [increaseFocusedMarkerIndex, decreaseFocusedMarkerIndex]);

  const focusOnLayer = (layer: Layer) => {
    zoomToBoundingBox(layer.path);
    if (focusedLayer !== layer) {
      setFocusedMarkerIndex(null);
      setFocusedLayer(layer);
    }
  };

  const RouteLayers: React.FC<{
    layers: Layer[];
    focusedIndex?: number | null;
    onPointClicked?: (index: number) => void;
  }> = ({ layers, focusedIndex, onPointClicked }) => {
    return (
      <>
        {layers.map((layer) => (
          <>
            {/* {visibility.get(layer) && layer.shouldRender() && ( */}
            {layer.shouldRender() && (
              <RouteLayer
                key={layer.name}
                path={layer.path}
                onPointClicked={onPointClicked}
              />
            )}
          </>
        ))}
      </>
    );
  };

  console.log(">>> rendering MapComponent");
  return (
    <>
      <TileProviderSelector
        onTileProviderChanged={(tileProvider) => {
          setTileProvider(tileProvider);
        }}
      />
      {/* center around Belgrade */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MapContainer
          center={[44.7866, 20.4489]}
          zoom={13}
          minZoom={0}
          maxZoom={18}
          style={{ height: "90vh" }}
          scrollWheelZoom
          ref={setMap}
          placeholder={<MapPlaceholder />}
        >
          <TileLayer
            attribution={tileProvider.getAttribution()}
            url={tileProvider.getUrl()}
          />

          <RouteLayers
            layers={routeLayers}
            focusedIndex={focusedMarkerIndex}
            onPointClicked={(index) => {
              setFocusedMarkerIndex(index);
            }}
          />
          {/* <PointLayers layers={geoPathLayers} /> */}
        </MapContainer>
        {layers.map((layer) => (
          <>
            <div
              key={layer.name}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
                backgroundColor: focusedLayer === layer ? "lightblue" : "white",
                padding: "10px",
                margin: "5px 0",
                border: "1px solid #ccc",
              }}
            >
              <input
                type="checkbox"
                checked={visibility.get(layer)}
                onChange={() => toggleVisibility(layer)}
              />
              {layer.name}
              <button onClick={() => focusOnLayer(layer)}>View</button>
            </div>
          </>
        ))}
      </div>
    </>
  );
}

function PointLayers({
  layers,
  focusedIndex,
  onPointClicked,
}: {
  layers: Layer[];
  focusedIndex?: number | null;
  onPointClicked?: (index: number) => void;
}) {
  return (
    <>
      {layers.map((layer) => (
        <>
          {layer.shouldRender() && (
            <RouteLayer
              key={layer.name}
              path={layer.path}
              onPointClicked={onPointClicked}
            />
          )}
        </>
      ))}
    </>
  );
}

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
