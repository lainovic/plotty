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
import { isTypingInInput } from "../../utils/keyboardUtils";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

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
  embedded?: boolean;
}

export const TileProviderSelector: React.FC<TileProviderSelectorProps> = ({
  onTileProviderChanged,
  embedded = false,
}) => {
  const [selectedVendor, setSelectedVendor] = React.useState<TileVendors>(TileVendors.OpenStreetMap);
  const [isKeyEditorOpen, setIsKeyEditorOpen] = React.useState(false);

  React.useEffect(() => {
    onTileProviderChanged(tileProviderMap.get(selectedVendor)!);
  }, [selectedVendor]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingInInput(event)) return;
      const key = event.key.toLowerCase();
      if (key !== "j" && key !== "k") return;
      setSelectedVendor((prev) => {
        const index = vendors.indexOf(prev);
        const next = key === "j" ? index + 1 : index - 1;
        return vendors[(next + vendors.length) % vendors.length];
      });
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const selectedProvider = tileProviderMap.get(selectedVendor);
  const authProvider =
    selectedProvider instanceof AuthTileProvider ? selectedProvider : null;
  const hasApiKey = !!authProvider?.getApiKey()?.trim();

  React.useEffect(() => {
    if (!embedded) return;
    setIsKeyEditorOpen(Boolean(authProvider && !hasApiKey));
  }, [embedded, authProvider, hasApiKey, selectedVendor]);

  return (
    <div style={embedded ? styles.embeddedContainer : styles.container}>
      <div style={embedded ? styles.providerStack : undefined}>
        <Select
          value={selectedVendor}
          onChange={(e: SelectChangeEvent<TileVendors>) =>
            setSelectedVendor(e.target.value as TileVendors)
          }
          inputProps={{ "aria-label": "Map tile provider" }}
          size={embedded ? "small" : "medium"}
          sx={{
            width: embedded ? "100%" : undefined,
            color: `${tomtomBlackColor}`,
            backgroundColor: embedded ? "rgba(255,255,255,0.82)" : undefined,
            borderRadius: embedded ? "9px" : undefined,
            "& .MuiSelect-select": {
              fontSize: embedded ? "0.82rem" : undefined,
              fontWeight: embedded ? 500 : undefined,
              paddingTop: embedded ? "7px" : undefined,
              paddingBottom: embedded ? "7px" : undefined,
              paddingLeft: embedded ? "12px" : undefined,
            },
            "& .MuiSvgIcon-root": { color: `${tomtomSecondaryColor}` },
          }}
        >
          {vendors.map((vendor) => (
            <MenuItem key={vendor} value={vendor}>
              {vendor}
            </MenuItem>
          ))}
        </Select>
      </div>
      {authProvider && embedded && (
        <div style={styles.keySection}>
          <button
            type="button"
            style={styles.keyToggle}
            onClick={() => setIsKeyEditorOpen((prev) => !prev)}
            aria-expanded={isKeyEditorOpen}
          >
            <span style={styles.keyToggleLead}>
              <KeyOutlinedIcon style={styles.keyIcon} />
              {hasApiKey ? "API key saved" : "Add API key"}
            </span>
            <span style={styles.keyToggleMeta}>
              {isKeyEditorOpen ? "Hide" : "Edit"}
              {isKeyEditorOpen ? (
                <KeyboardArrowUpIcon fontSize="small" />
              ) : (
                <KeyboardArrowDownIcon fontSize="small" />
              )}
            </span>
          </button>
          {isKeyEditorOpen && (
            <PasswordInput
              key={selectedVendor}
              label="API key"
              initialValue={authProvider.getApiKey() || ""}
              onValueChange={(key) => {
                authProvider.setApiKey(key);
                onTileProviderChanged(authProvider);
              }}
              compact
              style={styles.embeddedKeyField}
            />
          )}
        </div>
      )}
      {authProvider && !embedded && (
        <PasswordInput
          key={selectedVendor}
          label="API key"
          initialValue={authProvider.getApiKey() || ""}
          onValueChange={(key) => {
            authProvider.setApiKey(key);
            onTileProviderChanged(authProvider);
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
    backgroundColor: "hsla(0, 0%, 100%, 0.8)",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    zIndex: Z_INDEX.TILE_PROVIDER,
  },
  embeddedContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    alignItems: "stretch",
    justifyContent: "start",
    fontFamily: "'Roboto', sans-serif",
    width: "100%",
  },
  providerStack: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
    alignItems: "stretch",
  },
  keySection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginTop: "1px",
  },
  keyToggle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "4px 2px 3px",
    border: "none",
    background: "transparent",
    font: "inherit",
    color: "rgba(0,0,0,0.62)",
    cursor: "pointer",
    textAlign: "left",
  },
  keyToggleLead: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.68rem",
    fontWeight: 600,
  },
  keyIcon: {
    fontSize: "0.95rem",
    color: `${tomtomSecondaryColor}`,
  },
  keyToggleMeta: {
    display: "inline-flex",
    alignItems: "center",
    gap: "2px",
    fontSize: "0.62rem",
    color: "rgba(0,0,0,0.44)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  embeddedKeyField: {
    color: `${tomtomBlackColor}`,
    width: "100%",
    marginTop: "-1px",
  },
};
