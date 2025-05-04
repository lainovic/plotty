import React from "react";

export function useInputHandling() {
  React.useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      event.preventDefault();
      const pastedText = event.clipboardData?.getData("text");
      handleText(pastedText || "");
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer?.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result as string;
          handleText(content);
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
}

function handleText(input: string, setLoading: (loading: boolean) => void) {
  if (input === "") {
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
          console.log(`>>> parse successful with ${parser.constructor.name}!`);
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
