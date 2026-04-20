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
    <div>
      <header style={styles.header}>
        Plo<span style={styles.headerSpan}>tt</span>y
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
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: "0.85rem",
    color: `${tomtomBlackColor}`,
    fontFamily: "'Roboto', sans-serif",
    textTransform: "uppercase",
    fontWeight: 700,
    height: "32px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "10px",
  },
  headerSpan: {
    color: `${tomtomSecondaryColor}`,
  },
};

export default App;
