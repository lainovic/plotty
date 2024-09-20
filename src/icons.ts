import { Icon } from "leaflet";

export const originIcon = new Icon({
  iconUrl: "public/icons/origin.svg",
  iconSize: [64, 64],
  iconAnchor: [32, 36],
  popupAnchor: [0, 0],
});

export const waypointIcon = new Icon({
    iconUrl: "public/icons/waypoint.svg",
    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  });

export const destinationIcon = new Icon({
  iconUrl: "public/icons/destination.svg",
  iconSize: [64, 64], // size of the icon
  iconAnchor: [32, 42], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
});
