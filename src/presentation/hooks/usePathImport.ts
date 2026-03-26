import React from "react";
import { Path } from "../../domain/entities/Path";
import { ParseService } from "../../domain/services/ParseService";
import { toast } from "react-toastify";

const parseService = new ParseService();

type UsePathImportProps<T extends Path<any>> = {
  onPathsImported: (paths: T[]) => void;
};

export function usePathImport<T extends Path<any>>({
  onPathsImported,
}: UsePathImportProps<T>) {
  const [importing, setImporting] = React.useState(false);

  const parseNonBlocking = async (content: string) => {
    setImporting(true);
    try {
      // Ensure the importing state is rendered before heavy processing.
      await new Promise((resolve) => setTimeout(resolve, 50));

      const result = parseService.parse<T>(content);
      toast.success(result.message);
      if (result.paths.length > 0) {
        onPathsImported(result.paths);
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setImporting(false);
    }
  };

  React.useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      event.preventDefault();
      await parseNonBlocking(event.clipboardData?.getData("text") || "");
    };

    const handleDrop = async (event: DragEvent) => {
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

    const preventDefault = (event: Event) => event.preventDefault();

    document.body.addEventListener("paste", handlePaste);
    document.body.addEventListener("drop", handleDrop);
    document.body.addEventListener("dragover", preventDefault);

    return () => {
      document.body.removeEventListener("paste", handlePaste);
      document.body.removeEventListener("drop", handleDrop);
      document.body.removeEventListener("dragover", preventDefault);
    };
  }, [onPathsImported]);

  return { importing };
}
