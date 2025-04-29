import React from "react";

import {
  tomtomBlackColor,
  tomtomPrimaryColor,
  tomtomSecondaryColor,
} from "./colors";

const defaultColors = [
  tomtomPrimaryColor,
  tomtomSecondaryColor,
  tomtomBlackColor,
  "#FF9E80",
  "#FF80AB",
  "#EA80FC",
  "#8C9EFF",
  "#FF6E40",
  "#FF4081",
  "#AA00FF",
  "#2962FF",
  "#00B0FF",
  "#00E5FF",
  "#84FFFF",
  "#00E676",
  "#76FF03",
  "#AEEA00",
  "#FFAB00",
  "#FF6D00",
  "#3E2723",
  "#8D6E63",
  "#D7CCC8",
];

function useLayerColors(colors = defaultColors) {
  const layerColorsMap = React.useRef(new Map());
  const colorCounter = React.useRef(0);

  const getColorForLayer = (layerName: string) => {
    if (!layerColorsMap.current.has(layerName)) {
      const color = colors[colorCounter.current];
      colorCounter.current = (colorCounter.current + 1) % colors.length;
      layerColorsMap.current.set(layerName, color);
    }
    return layerColorsMap.current.get(layerName);
  };

  return getColorForLayer;
}

export default useLayerColors;
