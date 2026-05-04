import React, { createContext } from "react";

export interface FocusContextType {
  focusLayer(id: string): void;
  blur(): void;
  isFocused(id: string): boolean;
}

export const FocusContext = createContext<FocusContextType | null>(null);

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [focusedLayerId, setFocusedLayerId] = React.useState<string | null>(null);

  const focusLayer = React.useCallback((id: string) => setFocusedLayerId(id), []);
  const blur = React.useCallback(() => setFocusedLayerId(null), []);
  const isFocused = React.useCallback((id: string) => focusedLayerId === id, [focusedLayerId]);

  return (
    <FocusContext.Provider value={{ focusLayer, blur, isFocused }}>
      {children}
    </FocusContext.Provider>
  );
};
