import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { TileProviderSelector } from "./overlays/TileProviderSelector";
import { openStreetMapTileProvider } from "../providers/const";
import { MapLayers } from "./MapLayers";
import { onlyInDevelopment, useRenderTime } from "../hooks/useRenderTime";

function MapPlaceholder() {
  return (
    <p>
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

export const MapComponent = () => {
  useRenderTime("MapComponent", onlyInDevelopment);

  const [tileConfig, setTileConfig] = React.useState(() => ({
    url: openStreetMapTileProvider.getUrl(),
    attribution: openStreetMapTileProvider.getAttribution(),
    maxZoom: openStreetMapTileProvider.getMaxZoom(),
  }));

  return (
    <>
      <div style={styles.container}>
        <MapContainer
          style={styles.map}
          center={[44.82, 20.41]} // New Belgrade
          zoom={11}
          minZoom={0}
          maxZoom={tileConfig.maxZoom}
          scrollWheelZoom
          placeholder={<MapPlaceholder />}
        >
          <TileLayer
            attribution={tileConfig.attribution}
            url={tileConfig.url}
            minZoom={0}
            maxZoom={tileConfig.maxZoom}
          />
          <MapLayers />
        </MapContainer>
        <TileProviderSelector
          onTileProviderChanged={(p) => {
            setTileConfig({
              url: p.getUrl(),
              attribution: p.getAttribution(),
              maxZoom: p.getMaxZoom(),
            });
          }}
        />
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  map: {
    width: "100vw",
    height: "calc(100vh - 32px)",
  },
};
