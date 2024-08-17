import React from "react";

import {
  LayerGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import TileProviderSelector from "./providers/TileProviderSelector";

import { TileProvider } from "./providers/TileProvider";
import {
  Path,
  RoutePath,
  GeoPath,
  TtpPath,
  LogcatPath,
} from "./types/paths";
import { openStreetMapTileProvider } from "./providers/const";
import { Icon } from "leaflet";
import { GeoPoint } from "./types/geo_types";

class Layer {
  path: Path;
  visible: boolean;
  name: string;
  constructor(
    path: Path,
    visible: boolean = true,
    name: string | null = null
  ) {
    this.path = path;
    this.visible = visible;
    if (name === null) {
      name = path.name;
    }
    this.name = name;
  }

  shouldRender(): boolean {
    return this.visible && this.path.notEmpty();
  }
}

function filter<T>(paths: Path[], typeT: new (...params: any[]) => T): T[] {
  return paths.filter((item) => item instanceof typeT) as T[];
}

function pathsToLayers<T extends Path>(
  paths: Path[],
  typeT: new (...params: any[]) => T
): Layer[] {
  return filter(paths, typeT).map((path) => new Layer(path)) as Layer[];
}

function MapPlaceholder() {
  return (
    <p>
      A Map.{" "}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

/**
 * Renders a map view with the provided data.
 *
 * @param {Object} paths - The paths to render on the map.
 * @returns A React component that renders the map view.
 */
export default function MapView({ paths }: { paths: Path[] }) {
  const [map, setMap] = React.useState<L.Map | null>(null);

  /**
   * Handles the click event on a path item in the map view.
   *
   * When a path item is clicked, this function calculates the bounding box of the path and
   * flies the map to that bounding box, centering and zooming the map to fit the path.
   *
   * @param path - The path that was clicked.
   */
  function zoomMapToPathBoundingBox(path: Path) {
    if (path.empty()) return;
    const { minLatitude, maxLatitude, minLongitude, maxLongitude } =
      getBoundingBox(path);
    map?.flyToBounds([
      [minLatitude, minLongitude],
      [maxLatitude, maxLongitude],
    ]);
  }

  const [tileProvider, setTileProvider] = React.useState<TileProvider>(
    openStreetMapTileProvider
  );

  const routeLayers = pathsToLayers(paths, RoutePath);
  console.log("route layers", routeLayers);
  const geoPathLayers = pathsToLayers(paths, GeoPath);
  console.log("geo-layers", geoPathLayers);
  const ttpPathLayers = pathsToLayers(paths, TtpPath);
  console.log("TTP layers", ttpPathLayers);
  const logcatPathLayers = pathsToLayers(paths, LogcatPath);
  console.log("Logcat layers", logcatPathLayers);

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
          preferCanvas={true}
          center={[44.7866, 20.4489]}
          zoom={13}
          minZoom={0}
          maxZoom={18}
          style={{ height: "100vh" }}
          scrollWheelZoom={true}
          ref={setMap}
          placeholder={<MapPlaceholder />}
        >
          <TileLayer
            attribution={tileProvider.getAttribution()}
            url={tileProvider.getUrl()}
          />
          <PointLayers layers={routeLayers} />
          <PointLayers layers={geoPathLayers} />
          <PointLayers layers={ttpPathLayers} />
          <PointLayers layers={logcatPathLayers} />
        </MapContainer>
        <ul>
          Visible layers:
          {[
            ...routeLayers,
            ...geoPathLayers,
            ...ttpPathLayers,
            ...logcatPathLayers,
          ].map((layer) => (
            <>
              {layer.shouldRender() && (
                <li
                  key={layer.name}
                  onClick={() => {
                    zoomMapToPathBoundingBox(layer.path);
                  }}
                >
                  {layer.name}
                </li>
              )}
            </>
          ))}
        </ul>
      </div>
    </>
  );
}

const pointIcon = new Icon({
  iconUrl: "https://img.icons8.com/forma-bold-filled/24/marker.png",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, 0],
});

const originIcon = new Icon({
  iconUrl: "https://img.icons8.com/pulsar-line/48/navigation.png",
  iconSize: [32, 32],
  iconAnchor: [24, 24],
  popupAnchor: [0, 0],
});

const destinationIcon = new Icon({
  iconUrl: "https://img.icons8.com/pastel-glyph/64/filled-flag2.png",
  iconSize: [32, 32], // size of the icon
  iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
});

function PointLayer({ path }: { path: Path }) {
  const origin = path.points[0];
  const destination = path.points[path.points.length - 1];
  return (
    <LayerGroup>
      {path.points.slice(1, -1).map((point, index) => (
        <Point key={index} point={point} />
      ))}
      <Point key={0} point={origin} icon={originIcon} />
      <Point
        key={path.points.length - 1}
        point={destination}
        icon={destinationIcon}
      />
    </LayerGroup>
  );
}

function Point({ point, icon = pointIcon }: { point: GeoPoint; icon?: Icon }) {
  return (
    <Marker position={[point.latitude, point.longitude]} icon={icon}>
      <Popup>
        <b>{`${point.latitude}, ${point.longitude}`}</b>
        <br />
      </Popup>
    </Marker>
  );
}

function PointLayers({ layers }: { layers: Layer[] }) {
  return (
    <>
      {layers.map((layer) => (
        <>{layer.shouldRender() && <PointLayer path={layer.path} />}</>
      ))}
    </>
  );
}

/**
 * Represents the bounding box of a geographic area,
 * used to define the visible area of a map for purposes such as
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
