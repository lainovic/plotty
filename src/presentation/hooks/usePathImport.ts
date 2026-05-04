import React from "react";
import { AnyPath } from "../../domain/entities/Path";
import { ParseService } from "../../domain/services/ParseService";
import { toast } from "react-toastify";

const parseService = new ParseService();
const INTERACTIVE_SELECTOR = [
  "input",
  "textarea",
  "button",
  "select",
  "option",
  "[contenteditable='true']",
  "[contenteditable='']",
  "[role='textbox']",
].join(", ");

type UsePathImportProps = {
  target: HTMLElement | null;
  onPathsImported: (paths: AnyPath[]) => void;
};

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || target.closest(INTERACTIVE_SELECTOR) !== null;
}

export function usePathImport({
  target,
  onPathsImported,
}: UsePathImportProps) {
  const [importing, setImporting] = React.useState(false);

  const parseNonBlocking = async (content: string) => {
    setImporting(true);
    try {
      // Ensure the importing state is rendered before heavy processing.
      await new Promise((resolve) => setTimeout(resolve, 50));

      const result = parseService.parse(content);
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
    if (!target) return;
    const previousTabIndex = target.getAttribute("tabindex");

    const focusTarget = (event: MouseEvent) => {
      if (event.target === target) {
        target.focus();
      }
    };

    const handlePaste = async (event: ClipboardEvent) => {
      if (isInteractiveTarget(event.target)) {
        return;
      }
      event.preventDefault();
      await parseNonBlocking(event.clipboardData?.getData("text") || "");
    };

    const handleDrop = async (event: DragEvent) => {
      if (isInteractiveTarget(event.target)) {
        return;
      }
      if (!event.dataTransfer?.files.length) return;
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

    const preventDefault = (event: DragEvent) => {
      if (isInteractiveTarget(event.target)) return;
      if (event.dataTransfer?.types.includes("Files")) {
        event.preventDefault();
      }
    };

    if (previousTabIndex === null) {
      target.tabIndex = 0;
    }
    target.addEventListener("paste", handlePaste);
    target.addEventListener("drop", handleDrop);
    target.addEventListener("dragover", preventDefault);
    target.addEventListener("click", focusTarget);

    return () => {
      target.removeEventListener("paste", handlePaste);
      target.removeEventListener("drop", handleDrop);
      target.removeEventListener("dragover", preventDefault);
      target.removeEventListener("click", focusTarget);
      if (previousTabIndex === null) {
        target.removeAttribute("tabindex");
      }
    };
  }, [onPathsImported, target]);

  return { importing };
}
