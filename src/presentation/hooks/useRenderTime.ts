import React from "react";

export const useRenderTime = (
  componentName: string,
  enabled: boolean = true
) => {
  const renderStartTime = React.useRef(performance.now());

  React.useEffect(() => {
    if (!enabled) return;

    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);

    // Reset for next render
    renderStartTime.current = performance.now();
  });
};

export const onlyInDevelopment = import.meta.env.MODE === "development";
