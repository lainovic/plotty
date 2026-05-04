import { toast } from "react-toastify";

export async function copyToClipboard(
  value: string,
  successMessage: string,
  failureMessage: string = "Failed to copy to clipboard",
  options: { notifyOnSuccess?: boolean } = {}
) {
  const { notifyOnSuccess = true } = options;
  try {
    await navigator.clipboard.writeText(value);
    if (notifyOnSuccess) {
      toast.success(successMessage);
    }
    return true;
  } catch {
    toast.error(failureMessage);
    return false;
  }
}
