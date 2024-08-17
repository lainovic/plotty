import React from "react";
import "./App.css";
import { Message } from "./types/common";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MapView from "./MapView";
import RoutingResponseParser from "./parsers/RoutingResponseParser";
import { Path } from "./types/paths";
import { ParsedResult } from "./parsers/Parser";

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

  React.useEffect(() => {
    handleInputDataChange();
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

  function handleInputDataChange() {
    if (inputData === "") {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      let parseSuccess = false;
      for (const parser of [routingResponseParser]) {
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
            console.log(
              `Error: ${error.value}`
            );
          });
      }
      if (!parseSuccess) {
        setFailureMessage({ value: "Failed to parse input data" });
      }
      setLoading(false);
    });
  }

  return (
    <div onPaste={handlePaste}>
      <header>Plotty</header>
      {isLoading && (
        <div className="loader-container">
          <div className="loader-spinner"></div>
        </div>
      )}
      <main>
        <MapView paths={paths} />
      </main>
      <footer></footer>
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
    </div>
  );
}

export default App;
