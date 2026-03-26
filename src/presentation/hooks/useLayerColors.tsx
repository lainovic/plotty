import React from "react";
import { defaultColors } from "../../shared/colors";

export function useColors(colors = defaultColors) {
  const colorCounter = React.useRef(0);

  const getNextColor = () => {
    const color = colors[colorCounter.current];
    colorCounter.current = (colorCounter.current + 1) % colors.length;
    return color;
  };

  return { getNextColor };
}
