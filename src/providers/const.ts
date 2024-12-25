import { localStorageKeys } from "../const";
import { TileProvider, AuthTileProvider } from "./TileProvider";

export const openStreetMapTileProvider = new TileProvider(
  "Open Street Map",
  "&copy; OpenStreetMap contributors",
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  20
);

export const googleMapsTileProvider = new TileProvider(
  "Google Maps",
  "&copy; Google",
  "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  22
);

export const tomTomMapsOrbisTileProvider = new AuthTileProvider(
  "TomTom Orbis Maps",
  "&copy; TomTom Orbis Maps",
  "https://api.tomtom.com/maps/orbis/map-display/tile/{z}/{x}/{y}.png?apiVersion=1",
  localStorageKeys.tomtomApiKey,
  22
);

export const tomtomMapsGenesisTileProvider = new AuthTileProvider(
  "TomTom Maps",
  "&copy; TomTom Maps",
  "https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png",
  localStorageKeys.tomtomApiKey,
  22
);
