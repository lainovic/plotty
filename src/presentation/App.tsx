import "../App.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tomtomBlackColor, tomtomSecondaryColor } from "../shared/colors";
import { MapComponent } from "./components/MapComponent";
import { HelpPopup } from "./components/overlays/HelpPopup";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <div style={styles.appShell}>
      <header style={styles.header}>
        <div style={styles.headerBlock}>
          <div style={styles.kicker}>Geospatial utility</div>
          <div style={styles.headerWordmark}>
            Plo<span style={styles.headerSpan}>tt</span>y
          </div>
        </div>
        <div style={styles.headerNote}>
          Import coordinates, routes, and logs. Inspect layers fast.
        </div>
      </header>
      <main style={styles.container}>
        <ErrorBoundary>
          <MapComponent />
        </ErrorBoundary>
      </main>
      <ToastContainer
        position="top-center"
        hideProgressBar
        autoClose={1500}
        closeOnClick
        pauseOnHover
        style={{
          height: "50px",
          textAlign: "center",
        }}
      />
      <HelpPopup></HelpPopup>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  appShell: {
    position: "relative",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(25,136,207,0.12), transparent 28%), radial-gradient(circle at top right, rgba(223,27,18,0.10), transparent 24%), #f6f7f8",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "fixed",
    top: "10px",
    left: "10px",
    right: "10px",
    zIndex: 1500,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
    color: `${tomtomBlackColor}`,
    fontFamily: "'Roboto', sans-serif",
  },
  headerBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  kicker: {
    fontSize: "0.62rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "rgba(0,0,0,0.42)",
    fontWeight: 700,
  },
  headerWordmark: {
    fontSize: "1rem",
    textTransform: "uppercase",
    fontWeight: 700,
    letterSpacing: "0.04em",
  },
  headerSpan: {
    color: `${tomtomSecondaryColor}`,
  },
  headerNote: {
    fontSize: "0.75rem",
    color: "rgba(0,0,0,0.56)",
    textAlign: "right",
    maxWidth: "260px",
    lineHeight: 1.35,
  },
};

export default App;
