import React from "react";
import { Path } from "../../domain/entities/Path";
import { useMapContext } from "../contexts/useMapContext";
import { ImportMessage } from "../../application/services/PathImportService";
import { toast } from "react-toastify";

type UsePathImportProps<T extends Path<any>> = {
  onPathsImported: (paths: T[]) => void;
};

export function usePathImport<T extends Path<any>>({
  onPathsImported,
}: UsePathImportProps<T>) {
  const { pathImportService: importService } = useMapContext();
  const [message, setMessage] = React.useState<ImportMessage | null>(null);
  const [importing, setImporting] = React.useState(false);

  React.useEffect(() => {
    if (!message || message.text === "") return;
    if (message.type === "success") {
      toast.success(message.text);
    } else {
      toast.error(message.text);
    }
  }, [message]);

  const parseNonBlocking = async (content: string) => {
    setImporting(true);
    try {
      // Ensure the importing state is rendered before heavy processing.
      await new Promise((resolve) => setTimeout(resolve, 50));

      const result = importService.importFromText<T>(content);
      setMessage(result.message);
      if (result.message.type === "success" && result.paths.length > 0) {
        onPathsImported(result.paths);
      }
    } finally {
      setImporting(false);
    }
  };

  React.useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      // Don't handle paste if we're in a text input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      event.preventDefault();
      const content = event.clipboardData?.getData("text");
      await parseNonBlocking(content || "");
    };

    const handleDrop = async (event: DragEvent) => {
      // Don't handle drop if we're in a text input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      event.preventDefault();
      const file = event.dataTransfer?.files[0];
      if (file) {
        const content = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsText(file);
        });
        await parseNonBlocking(content);
      }
    };

    const preventDefault = (event: Event) => {
      event.preventDefault();
    };

    document.body.addEventListener("paste", handlePaste);
    document.body.addEventListener("drop", handleDrop);
    document.body.addEventListener("dragover", preventDefault);

    return () => {
      document.body.removeEventListener("paste", handlePaste);
      document.body.removeEventListener("drop", handleDrop);
      document.body.removeEventListener("dragover", preventDefault);
    };
  }, [onPathsImported]);

  return {
    message,
    importing,
  };
}
