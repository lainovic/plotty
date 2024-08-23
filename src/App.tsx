import React from "react";
import "./App.css";
import { Message } from "./types/common";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MapComponent from "./MapComponent";
import RoutingResponseParser from "./parsers/RoutingResponseParser";
import { Path } from "./types/paths";
import { ParsedResult } from "./parsers/Parser";
import GeoPointsParser from "./parsers/GeoPointsParser";
import { tomtomBlackColor, tomtomSecondaryColor } from "./colors";
import CssTransitionComponent from "./HelpPopup";

function App() {
  const [inputData, setInputData] = React.useState<string>("");
  const [paths, setPaths] = React.useState<Path[]>([]);

  const [failureMessage, setFailureMessage] = React.useState<Message | null>(
    null
  );
  const [successMessage, setSuccessMessage] = React.useState<Message | null>(
    null
  );

  const [isLoading, setLoading] = React.useState<boolean>(false);

  const routingResponseParser = new RoutingResponseParser();
  const geoPointsParser = new GeoPointsParser();

  React.useEffect(() => {
    handleInput();
  }, [inputData]);

  React.useEffect(() => {
    if (failureMessage && failureMessage.value !== "") {
      toast.error(failureMessage.value);
    }
  }, [failureMessage]);

  React.useEffect(() => {
    if (successMessage && successMessage.value !== "") {
      toast.success(successMessage.value);
    }
  }, [successMessage]);

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text");
    setInputData(pastedText);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      setInputData(content);
    };
    reader.readAsText(file);
  };

  // TODO add support for dropping files
  // TODO add ruler mode

  function handleInput() {
    if (inputData === "") {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      let parseSuccess = false;
      for (const parser of [routingResponseParser, geoPointsParser]) {
        if (parseSuccess) {
          break;
        }
        parser
          .parse(inputData)
          .ifSuccess((parsedPaths: ParsedResult<Path[]>) => {
            console.log(`Parsed successfully with ${parser.constructor.name}!`);
            console.log(parsedPaths);
            setSuccessMessage({
              value: parsedPaths.message.value,
            });
            setPaths((prevPaths) => [...prevPaths, ...parsedPaths.result]);
            parseSuccess = true;
          })
          .ifFailure((error) => {
            console.log(`Error: ${error.value}`);
          });
      }
      if (!parseSuccess) {
        setFailureMessage({ value: "Failed to parse input data" });
      }
      setLoading(false);
    });
  }

  return (
    <div
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <header style={styles.header}>
        Plo<span style={styles.headerSpan}>tt</span>y
      </header>
      {isLoading && (
        <div className="loader-container">
          <div className="loader-spinner"></div>
        </div>
      )}
      <main style={styles.container}>
        <MapComponent paths={paths} />
      </main>
      <footer style={styles.footer}></footer>
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
      <CssTransitionComponent></CssTransitionComponent>
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
    fontSize: "1.0rem",
    color: `${tomtomBlackColor}`,
    fontFamily: "'Roboto', sans-serif",
    textTransform: "uppercase",
    fontWeight: 700,
    height: "5vh",
    display: "flex",
    alignItems: "center",
    paddingLeft: "10px",
  },
  footer: {
    height: "5vh",
  },
  headerSpan: {
    color: `${tomtomSecondaryColor}`,
  },
};
export default App;
