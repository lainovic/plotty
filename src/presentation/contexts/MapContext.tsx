import React, { createContext, useContext, ReactNode } from "react";
import { LayerService } from "../../application/LayerService";
import { LayerRepository } from "../../infrastructure/repositories/LayerRepository";
import { EventPublisher } from "../../domain/events/EventPublisher";

interface MapContextType {
  layerService: LayerService;
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
  const layerRepository = new LayerRepository();

  const eventPublisher = new EventPublisher();

  const layerService = new LayerService(layerRepository, eventPublisher);

  const value = {
    layerService,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
