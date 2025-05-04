import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { TileProviderSelector } from "./overlays/TileProviderSelector";
import { TileProvider } from "../providers/TileProvider";
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

  const [selectedTileProvider, selectTileProvider] =
    React.useState<TileProvider>(openStreetMapTileProvider);

  return (
    <>
      <div style={styles.container}>
        <MapContainer
          style={styles.map}
          center={[44.82, 20.41]} // New Belgrade
          zoom={11}
          minZoom={0}
          maxZoom={selectedTileProvider.getMaxZoom()}
          scrollWheelZoom
          placeholder={<MapPlaceholder />}
        >
          <TileLayer
            attribution={selectedTileProvider.getAttribution()}
            url={selectedTileProvider.getUrl()}
            minZoom={0}
            maxZoom={selectedTileProvider.getMaxZoom()}
          />
          <MapLayers />
        </MapContainer>
        <TileProviderSelector
          onTileProviderChanged={(tileProvider) => {
            selectTileProvider(tileProvider);
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
    height: "90vh",
  },
};
