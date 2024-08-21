import React from "react";
import PasswordInput from "../PasswordInput";
import { AuthTileProvider, TileProvider } from "./TileProvider";
import {
  googleMapsTileProvider,
  openStreetMapTileProvider,
  tomtomMapsGenesisTileProvider,
  tomTomMapsOrbisTileProvider,
} from "./const";

import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { emphasize } from "@mui/material";
import { tomtomBlackColor, tomtomSecondaryColor } from "../colors";

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

  function handleSelect(e: SelectChangeEvent<TileVendors>) {
    setSelectedTileVendor(e.target.value as TileVendors);
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
    <div style={styles.container}>
      <div>
        <FormHelperText>
          Tile provider (use <span style={styles.emphasize}>J</span> or{" "}
          <span style={styles.emphasize}>K</span> to switch)
        </FormHelperText>
        <Select
          value={selectedTileVendor}
          onChange={handleSelect}
          sx={{
            color: `${tomtomBlackColor}`,
            "&.MuiSvgIcon-root": {
              color: `${tomtomSecondaryColor}`,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: `${tomtomSecondaryColor}`,
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
          // TODO the text input does not work as expected
          <PasswordInput
            label="API key"
            value={selectedTileProvider.getApiKey() || ""}
            onValueChange={(key) => {
              selectedTileProvider.setApiKey(key);
              onTileProviderChanged(selectedTileProvider);
            }}
            style={{ marginLeft: "10px", color: `${tomtomBlackColor}` }}
          />
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "fixed",
    bottom: "6vh",
    left: "10px",
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    alignItems: "center",
    padding: "10px",
    minHeight: "50px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1000,
    borderRadius: "15px",
    minWidth: "500px",
  },
  emphasize: {
    color: emphasize(`${tomtomSecondaryColor}`, 0.1),
  },
};
