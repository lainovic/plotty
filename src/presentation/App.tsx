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
        <div style={styles.headerBrand}>
          <div style={styles.headerWordmark}>
            Plot<span style={styles.headerSpan}>ty</span>
          </div>
          <div style={styles.kicker}>Map utility</div>
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
    left: "68px",
    width: "fit-content",
    maxWidth: "calc(100vw - 78px)",
    zIndex: 1500,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "8px 12px",
    minHeight: "44px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
    color: `${tomtomBlackColor}`,
    fontFamily: "'Roboto', sans-serif",
  },
  headerBrand: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
  },
  kicker: {
    fontSize: "0.62rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "rgba(0,0,0,0.42)",
    fontWeight: 600,
  },
  headerWordmark: {
    fontSize: "0.98rem",
    textTransform: "uppercase",
    fontWeight: 800,
    letterSpacing: "0.02em",
  },
  headerSpan: {
    color: `${tomtomSecondaryColor}`,
  },
};

export default App;
