import { Icon } from "leaflet";

export const originIcon = new Icon({
  iconUrl: "icons/origin.png",
  iconSize: [40, 52], // size of the icon
  iconAnchor: [20, 52], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -30], // point from which the popup should open relative to the iconAnchor
});

export const waypointIcon = new Icon({
  iconUrl: "icons/waypoint.png",
  iconSize: [40, 52],
  iconAnchor: [20, 52],
  popupAnchor: [0, -30],
});


export const destinationIcon = new Icon({
  iconUrl: "icons/destination.png",
  iconSize: [40, 52],
  iconAnchor: [20, 52],
  popupAnchor: [0, -30],
});
