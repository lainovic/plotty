import React from "react";
import { ComponentName } from "../types/ComponentNames";

/**
 * A custom hook that measures and logs the render time of a component.
 *
 * @param componentName - The name of the component to be logged
 * @param enabled - Whether to enable the performance logging (defaults to true)
 * You can use it conditionally disable it if needed.
 * @returns void
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   useRenderTime('MapComponent');
 *   return <div>Content</div>;
 * };
 * ```
 */
export const useRenderTime = (
  componentName: ComponentName,
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
