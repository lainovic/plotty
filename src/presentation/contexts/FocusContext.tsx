import React, { createContext } from "react";

export interface FocusContextType {
  focusedLayerId: string | null;
  setFocusedLayerId: (id: string | null) => void;
}

export const FocusContext = createContext<FocusContextType | null>(null);

export const FocusProvider: React.FC<{
  children: React.ReactNode;
  focusedLayerId: string | null;
  setFocusedLayerId: (id: string | null) => void;
}> = ({ children, focusedLayerId, setFocusedLayerId }) => (
  <FocusContext.Provider value={{ focusedLayerId, setFocusedLayerId }}>
    {children}
  </FocusContext.Provider>
);
