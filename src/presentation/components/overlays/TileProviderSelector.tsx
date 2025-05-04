import React from "react";
import PasswordInput from "../../providers/PasswordInput";
import { AuthTileProvider, TileProvider } from "../../providers/TileProvider";
import {
  googleMapsTileProvider,
  openStreetMapTileProvider,
  tomtomMapsGenesisTileProvider,
  tomTomMapsOrbisTileProvider,
} from "../../providers/const";

import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { emphasize } from "@mui/material";
import { tomtomBlackColor, tomtomSecondaryColor } from "../../../shared/colors";
import { useMapContext } from "../../contexts/useMapContext";
import { ApiKeyChangedEvent } from "../../../domain/events/ApiKeyChangedEvent";
import { Z_INDEX } from "../../constants/zIndex";

/**
 * Represents the available tile vendors that can be used to fetch map tiles.
 */
enum TileVendors {
  TomTomOrbisMaps = "TomTom Orbis Maps",
  TomTomMaps = "TomTom Maps",
  OpenStreetMap = "Open Street Map",
  GoogleMap = "Google Maps",
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

interface TileProviderSelectorProps {
  onTileProviderChanged: (tileProvider: TileProvider) => void;
}

/**
 * A React component that allows the user to select a tile provider from a list of available options.
 *
 * @param onTileProviderChanged - A callback function that is called whenever the selected tile provider changes.
 */
export const TileProviderSelector: React.FC<TileProviderSelectorProps> = ({
  onTileProviderChanged,
}) => {
  const tileProviders = React.useRef<TileVendorMap>(
    new Map<TileVendors, TileProvider>([
      [TileVendors.TomTomOrbisMaps, tomTomMapsOrbisTileProvider],
      [TileVendors.TomTomMaps, tomtomMapsGenesisTileProvider],
      [TileVendors.OpenStreetMap, openStreetMapTileProvider],
      [TileVendors.GoogleMap, googleMapsTileProvider],
    ])
  );

  const { eventPublisher } = useMapContext();

  const tileVendorIterable = new TileVendorIterable();

  const [selectedTileVendor, setSelectedTileVendor] =
    React.useState<TileVendors>(Object.values(TileVendors)[0]);

  function handleSelect(e: SelectChangeEvent<TileVendors>) {
    setSelectedTileVendor(e.target.value as TileVendors);
  }

  const postApiKeyChangedEvent = React.useCallback(
    (key: string) => {
      const event = new ApiKeyChangedEvent(key);
      eventPublisher.publish(event);
    },
    [eventPublisher]
  );

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
    <div style={styles.container}>
      <Select
        value={selectedTileVendor}
        onChange={handleSelect}
        sx={{
          color: `${tomtomBlackColor}`,
          "&.MuiSvgIcon-root": {
            color: `${tomtomSecondaryColor}`,
          },
        }}
      >
        {[...tileProviders.current.keys()].map((provider) => (
          <MenuItem key={provider} value={provider}>
            {provider}
          </MenuItem>
        ))}
      </Select>
      {selectedTileProvider instanceof AuthTileProvider && (
        <PasswordInput
          label="API key"
          initialValue={selectedTileProvider.getApiKey() || ""}
          onValueChange={(key) => {
            selectedTileProvider.setApiKey(key);
            postApiKeyChangedEvent(key);
            onTileProviderChanged(selectedTileProvider);
          }}
          style={{ marginLeft: "10px", color: `${tomtomBlackColor}` }}
        />
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "fixed",
    bottom: "6vh",
    left: "10px",
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    alignItems: "center",
    justifyContent: "start",
    padding: "10px",
    minHeight: "50px",
    backgroundColor: "hsl(0, 0%, 100%, 0.8)",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    zIndex: Z_INDEX.TILE_PROVIDER,
  },
  emphasize: {
    color: emphasize(`${tomtomSecondaryColor}`, 0.1),
  },
};
