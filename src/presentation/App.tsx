import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import RoutingResponseParser from "../domain/parsers/RoutingResponseParser";
import { ParsedResult } from "../domain/parsers/Parser";
import GeoPointsParser from "../domain/parsers/GeoPointsParser";
import { tomtomBlackColor, tomtomSecondaryColor } from "../shared/colors";
import TtpParser from "../domain/parsers/TtpParser";
import { Path } from "../domain/entities/Path";
import { Message } from "../shared/Message";
import HelpPopup from "./components/overlays/HelpPopup";
import { MainComponent } from "./components/MainComponent";

function App() {
  const [inputData, setInputData] = React.useState<string>("");

  const [failureMessage, setFailureMessage] = React.useState<Message | null>(
    null
  );
  const [successMessage, setSuccessMessage] = React.useState<Message | null>(
    null
  );

  const [isLoading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    handleInput();
  }, [inputData]);

  React.useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      event.preventDefault();
      const pastedText = event.clipboardData?.getData("text");
      setInputData(pastedText || "");
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer?.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result as string;
          setInputData(content);
        };
        reader.readAsText(file);
      }
    };

    document.body.addEventListener("paste", handlePaste);
    document.body.addEventListener("drop", handleDrop);
    document.body.addEventListener("dragover", (event) =>
      event.preventDefault()
    );

    return () => {
      document.body.removeEventListener("paste", handlePaste);
      document.body.removeEventListener("drop", handleDrop);
      document.body.removeEventListener("dragover", (event) =>
        event.preventDefault()
      );
    };
  }, []);

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

  function handleInput() {
    if (inputData === "") {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      let parseSuccess = false;
      for (const parser of [
        new RoutingResponseParser(),
        new TtpParser(),
        new GeoPointsParser(),
      ]) {
        if (parseSuccess) {
          break;
        }
        parser
          .parse(inputData)
          .ifSuccess((parsedPaths: ParsedResult<Path[]>) => {
            console.log(
              `>>> parse successful with ${parser.constructor.name}!`
            );
            setSuccessMessage({
              value: parsedPaths.message.value,
            });
            setPaths((prevPaths) => [...prevPaths, ...parsedPaths.result]);
            parseSuccess = true;
          })
          .ifFailure((error) => {
            console.log(`>>> parse error: ${error.value}`);
          });
      }
      if (!parseSuccess) {
        setFailureMessage({ value: "Failed to parse input data" });
      }
      setLoading(false);
    });
  }

  return (
    <div>
      <header style={styles.header}>
        Plo<span style={styles.headerSpan}>tt</span>y
      </header>
      {isLoading && (
        <div className="loader-container">
          <div className="loader-spinner"></div>
        </div>
      )}
      <main style={styles.container}>
        <MainComponent />
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
