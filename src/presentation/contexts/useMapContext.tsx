import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { PathImportService } from "../../application/services/PathImportService";

interface MapContextType {
  pathImportService: PathImportService;
}

const MapContext = createContext<MapContextType | null>(null);

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};

interface MapProviderProps {
  children: ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const value = useMemo(
    () => ({ pathImportService: new PathImportService() }),
    []
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
