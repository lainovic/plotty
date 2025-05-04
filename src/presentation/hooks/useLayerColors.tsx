import React from "react";

import { defaultColors } from "../../shared/colors";
import { LayerId } from "../../domain/value-objects/LayerId";

export function useColors(colors = defaultColors) {
  const colorCounter = React.useRef(0);
  const colorMap = React.useRef(new Map<LayerId, string>());

  const getColorForLayer = (id: LayerId) => {
    if (!colorMap.current.has(id)) {
      const color = colors[colorCounter.current];
      colorCounter.current = (colorCounter.current + 1) % colors.length;
      colorMap.current.set(id, color);
    }
    return colorMap.current.get(id);
  };

  const getNextColor = () => {
    const color = colors[colorCounter.current];
    colorCounter.current = (colorCounter.current + 1) % colors.length;
    return color;
  };

  return { getNextColor, getColorForLayer };
}
