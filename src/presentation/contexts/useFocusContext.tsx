import React, { createContext, useContext } from "react";

interface FocusContextType {
  focusedLayerId: string | null;
  setFocusedLayerId: (id: string | null) => void;
}

const FocusContext = createContext<FocusContextType | null>(null);

export const useFocusContext = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error("useFocusContext must be used within a FocusProvider");
  }
  return context;
};

export const FocusProvider: React.FC<{
  children: React.ReactNode;
  focusedLayerId: string | null;
  setFocusedLayerId: (id: string | null) => void;
}> = ({ children, focusedLayerId, setFocusedLayerId }) => (
  <FocusContext.Provider value={{ focusedLayerId, setFocusedLayerId }}>
    {children}
  </FocusContext.Provider>
);
