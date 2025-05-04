import React from "react";

import { defaultColors } from "../../shared/colors";
import { LayerId } from "../../domain/value-objects/LayerId";

function useLayerColors(colors = defaultColors) {
  const colorCounter = React.useRef(0);
  const layerColorsMap = React.useRef(new Map<LayerId, string>());

  const getColorForLayer = (id: LayerId) => {
    if (!layerColorsMap.current.has(id)) {
      const color = colors[colorCounter.current];
      colorCounter.current = (colorCounter.current + 1) % colors.length;
      layerColorsMap.current.set(id, color);
    }
    return layerColorsMap.current.get(id);
  };

  return getColorForLayer;
}

export default useLayerColors;
