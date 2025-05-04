import React from "react";
import ReactDOM from "react-dom/client";
import App from "./presentation/App.tsx";
import "./reset.css";
import { MapProvider } from "./presentation/contexts/useMapContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MapProvider>
      <App />
    </MapProvider>
  </React.StrictMode>
);
