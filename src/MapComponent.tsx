import React from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import TileProviderSelector from "./providers/TileProviderSelector";
import { toast } from "react-toastify";
import { TileProvider } from "./providers/TileProvider";
import { GeoPath, Path, RoutePath, TtpPath } from "./types/paths";
import { openStreetMapTileProvider } from "./providers/const";
import RouteLayer from "./layers/RouteLayer";
import LayerPanel from "./LayerPanel";
import { getBoundingBox } from "./utils";
import PointLayer from "./layers/PointLayer";
import RulerPanel from "./RulerPanel";
import GotoDialog from "./GotoDialog";
import TtpLayer from "./layers/TtpLayer";
import useLayerColors from "./useLayerColors";

function MapPlaceholder() {
  return (
    <p>
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

type TileProviderContainer = {
  value: TileProvider;
};

/**
 * Renders a map view with provided paths.
 *
 * @param {Object} paths - The paths to render on the map.
 * @returns A React component that renders the map view.
 */
export default function MapComponent({ paths }: { paths: Path[] }) {
  const map = React.useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = React.useState(false);
  const layerColors = useLayerColors();

  React.useEffect(() => {
    if (!mapReady) return;

    map.current?.on("contextmenu", (e) => {
      const latlng = map.current!.mouseEventToLatLng(e.originalEvent);
      const coordinates = `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
      navigator.clipboard.writeText(coordinates);
      toast.success("Coordinates copied to clipboard.");
    });

    return () => {
      map.current?.off("contextmenu");
    };
  }, [mapReady]);

  const [tileProvider, setTileProvider] = React.useState<TileProviderContainer>(
    {
      value: openStreetMapTileProvider,
    }
  );

  const layerGroups = React.useRef<Map<number, L.LayerGroup | null>>(new Map());
  const setLayerGroup = React.useCallback(
    (index: number, group: L.LayerGroup | null) => {
      layerGroups.current.set(index, group);
    },
    []
  );

  const visibility = React.useRef<Map<number, boolean>>(new Map());

  // Add new paths visibilities with the default value of [true].
  paths.forEach((_, index) => {
    if (!visibility.current.has(index)) {
      visibility.current.set(index, true);
    }
  });

  const toggleVisibility = (index: number) => {
    if (!map.current) return;
    if (!visibility.current.has(index)) return;

    const newValue = !visibility.current.get(index);
    if (newValue) {
      layerGroups.current.get(index)?.addTo(map.current);
    } else {
      layerGroups.current.get(index)?.removeFrom(map.current);
    }
    visibility.current.set(index, newValue);
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

  function handleCoordinatesChange(lat: number, lon: number) {
    if (map.current) {
      map.current.flyTo([lat, lon], 15, { duration: 0.5 });
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
            color={layerColors(path.name)}
            visible={visibility.current.get(index) || false}
            onLayerReady={(group) => {
              setLayerGroup(index, group);
            }}
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
          <PointLayer
            key={path.name}
            path={path}
            color={layerColors(path.name)}
            visible={visibility.current.get(index) || false}
            onLayerReady={(group) => {
              setLayerGroup(index, group);
            }}
          />
        )
    );
  });

  const TtpLayers: React.FC<{ paths: Path[] }> = React.memo(({ paths }) => {
    console.log(">>> rendering TTP layers");
    return paths.map(
      (path, index) =>
        path.isNotEmpty() &&
        path instanceof TtpPath && (
          <TtpLayer
            key={path.name}
            path={path}
            color={layerColors(path.name)}
            visible={visibility.current.get(index) || false}
            onLayerReady={(group) => {
              setLayerGroup(index, group);
            }}
          />
        )
    );
  });

  console.log(">>> rendering map");

  return (
    <>
      <GotoDialog onCoordinatesChange={handleCoordinatesChange} />
      <div style={styles.container}>
        <TileProviderSelector
          onTileProviderChanged={(tileProvider) => {
            setTileProvider({ value: tileProvider });
          }}
        />
        <MapContainer
          style={styles.map}
          center={[44.82, 20.41]} // New Belgrade
          zoom={11}
          minZoom={0}
          maxZoom={tileProvider.value.getMaxZoom()}
          scrollWheelZoom
          ref={(r) => {
            map.current = r;
            setMapReady(true);
          }}
          placeholder={<MapPlaceholder />}
        >
          <TileLayer
            attribution={tileProvider.value.getAttribution()}
            url={tileProvider.value.getUrl()}
            minZoom={0}
            maxZoom={tileProvider.value.getMaxZoom()}
          />
          <ZoomText />
          <RulerPanel />
          <RouteLayers paths={paths} />
          <PointLayers paths={paths} />
          <TtpLayers paths={paths} />
        </MapContainer>
        <LayerPanel
          style={styles.layerPanel}
          paths={paths}
          onView={(path) => zoomToBoundingBox(path)}
          initialVisibility={visibility.current}
          onVisibilityChange={toggleVisibility}
        />
      </div>
    </>
  );
}

function ZoomText() {
  const [text, setText] = React.useState("");

  useMapEvents({
    zoomend: (e) => {
      setText(`Zoom level ${e.target.getZoom()}`);
    },
  });

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setText("");
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [text]);

  return text !== "" ? (
    <div style={styles.zoomLevelText}>
      <p>{text}</p>
    </div>
  ) : null;
}

const styles: { [key: string]: React.CSSProperties } = {
  zoomLevelText: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateY(-50%) translateX(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    fontFamily: "'Roboto', sans-serif",
    padding: "8px",
    borderRadius: "16px",
    zIndex: 1001,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  layerPanel: {
    position: "fixed",
    top: "50%",
    right: "10px",
    paddingTop: "10px",
    transform: "translateY(-50%)",
    backgroundColor: "hsl(0, 0%, 100%, 0.8)",
    fontFamily: "'Roboto', sans-serif",
    borderRadius: "12px",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxHeight: "250px",
  },
  map: {
    width: "100vw",
    height: "90vh",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 1002,
    pointerEvents: "none",
  },
};
