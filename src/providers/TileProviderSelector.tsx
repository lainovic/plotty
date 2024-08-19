import React from "react";
import PasswordInput from "../PasswordInput";
import { AuthTileProvider, TileProvider } from "./TileProvider";
import {
  googleMapsTileProvider,
  openStreetMapTileProvider,
  tomtomMapsGenesisTileProvider,
  tomTomMapsOrbisTileProvider,
} from "./const";

/**
 * Represents the available tile vendors that can be used to fetch map tiles.
 */
enum TileVendors {
  TomTomMaps = "TomTom Maps",
  GoogleMap = "Google Maps",
  TomTomOrbisMaps = "TomTom Orbis Maps",
  OpenStreetMap = "Open Street Map",
}

export class TileVendorIterable {
  private vendors = Object.values(TileVendors);
  private index: number = 0;

  next(): IteratorResult<TileVendors> {
    if (this.index < this.vendors.length - 1) {
      this.index++;
      return { done: false, value: this.vendors[this.index] };
    } else {
      return { done: true, value: undefined };
    }
  }

  prev(): IteratorResult<TileVendors> {
    if (this.index > 0) {
      this.index--;
      return { done: false, value: this.vendors[this.index] };
    } else {
      return { done: true, value: undefined };
    }
  }
}

type TileVendorMap = Map<TileVendors, TileProvider>;

/**
 * A React component that allows the user to select a tile provider from a list of available options.
 *
 * @param onTileProviderChanged - A callback function that is called whenever the selected tile provider changes.
 */
export default function TileProviderSelector({
  onTileProviderChanged,
}: {
  onTileProviderChanged: (tileProvider: TileProvider) => void;
}) {
  const tileProviders = React.useRef<TileVendorMap>(
    new Map<TileVendors, TileProvider>([
      [TileVendors.OpenStreetMap, openStreetMapTileProvider],
      [TileVendors.GoogleMap, googleMapsTileProvider],
      [TileVendors.TomTomMaps, tomtomMapsGenesisTileProvider],
      [TileVendors.TomTomOrbisMaps, tomTomMapsOrbisTileProvider],
    ])
  );

  const tileVendorIterable = new TileVendorIterable();

  const [selectedTileVendor, setSelectedTileVendor] =
    React.useState<TileVendors>(Object.values(TileVendors)[0]);

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedVendor = e.target.value as TileVendors;
    setSelectedTileVendor(selectedVendor);
  }

  React.useEffect(() => {
    const tileProvider = tileProviders.current.get(selectedTileVendor)!;
    onTileProviderChanged(tileProvider);
  }, [selectedTileVendor]);

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "j" || event.key === "J") {
        const nextTileVendor = tileVendorIterable.next();
        if (!nextTileVendor.done) {
          setSelectedTileVendor(nextTileVendor.value);
        }
      } else if (event.key === "k" || event.key === "K") {
        const prevTileVendor = tileVendorIterable.prev();
        if (!prevTileVendor.done) {
          setSelectedTileVendor(prevTileVendor.value);
        }
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const selectedTileProvider = tileProviders.current.get(selectedTileVendor);

  return (
    <>
      <span>Select a tile provider: </span>
      <select onChange={handleSelect} value={selectedTileVendor}>
        {[...tileProviders.current.keys()].map((layer) => (
          <option key={layer} value={layer}>
            {layer}
          </option>
        ))}
      </select>
      {selectedTileProvider instanceof AuthTileProvider && (
        <PasswordInput
          label="API key"
          value={selectedTileProvider.getApiKey() || ""}
          onValueChange={(key) => {
            selectedTileProvider.setApiKey(key);
            onTileProviderChanged(selectedTileProvider);
          }}
          style={{ marginLeft: "10px" }}
        />
      )}
    </>
  );
}
