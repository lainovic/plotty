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
import { tomtomBlackColor, tomtomSecondaryColor } from "../../../shared/colors";
import { Z_INDEX } from "../../constants/zIndex";

enum TileVendors {
  TomTomOrbisMaps = "TomTom Orbis Maps",
  TomTomMaps = "TomTom Maps",
  OpenStreetMap = "Open Street Map",
  GoogleMap = "Google Maps",
}

const vendors = Object.values(TileVendors);

const tileProviderMap: Map<TileVendors, TileProvider> = new Map([
  [TileVendors.TomTomOrbisMaps, tomTomMapsOrbisTileProvider],
  [TileVendors.TomTomMaps, tomtomMapsGenesisTileProvider],
  [TileVendors.OpenStreetMap, openStreetMapTileProvider],
  [TileVendors.GoogleMap, googleMapsTileProvider],
]);

interface TileProviderSelectorProps {
  onTileProviderChanged: (tileProvider: TileProvider) => void;
}

export const TileProviderSelector: React.FC<TileProviderSelectorProps> = ({
  onTileProviderChanged,
}) => {
  const [selectedVendor, setSelectedVendor] = React.useState<TileVendors>(vendors[0]);

  React.useEffect(() => {
    onTileProviderChanged(tileProviderMap.get(selectedVendor)!);
  }, [selectedVendor]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key !== "j" && key !== "k") return;
      setSelectedVendor((prev) => {
        const index = vendors.indexOf(prev);
        const next = key === "j" ? index + 1 : index - 1;
        return vendors[next] ?? prev;
      });
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const selectedProvider = tileProviderMap.get(selectedVendor);

  return (
    <div style={styles.container}>
      <Select
        value={selectedVendor}
        onChange={(e: SelectChangeEvent<TileVendors>) =>
          setSelectedVendor(e.target.value as TileVendors)
        }
        sx={{
          color: `${tomtomBlackColor}`,
          "&.MuiSvgIcon-root": { color: `${tomtomSecondaryColor}` },
        }}
      >
        {vendors.map((vendor) => (
          <MenuItem key={vendor} value={vendor}>
            {vendor}
          </MenuItem>
        ))}
      </Select>
      {selectedProvider instanceof AuthTileProvider && (
        <PasswordInput
          label="API key"
          initialValue={selectedProvider.getApiKey() || ""}
          onValueChange={(key) => {
            selectedProvider.setApiKey(key);
            onTileProviderChanged(selectedProvider);
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
};
