import React, { createContext, useContext, ReactNode } from "react";
import { LayerService } from "../../application/services/LayerService";
import { LayerRepository } from "../../infrastructure/repositories/LayerRepository";
import { EventPublisher } from "../../domain/events/EventPublisher";
import { PathImportService } from "../../application/services/PathImportService";

interface MapContextType {
  pathImportService: PathImportService;
  layerService: LayerService;
  eventPublisher: EventPublisher;
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
  const eventPublisher = new EventPublisher();
  const pathImportService = new PathImportService(eventPublisher);
  const layerRepository = new LayerRepository();
  const layerService = new LayerService(layerRepository, eventPublisher);

  const value = {
    pathImportService,
    layerService,
    eventPublisher,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
