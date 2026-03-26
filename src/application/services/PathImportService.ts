import { Path } from "../../domain/entities/Path";
import { ParseService } from "../../domain/services/ParseService";
import { Maybe } from "../../shared/Maybe";

export type ImportMessage = {
  type: "success" | "error";
  text: string;
};

export interface ImportResult<T extends Path<any>> {
  paths: T[];
  message: ImportMessage;
}

export class PathImportService {
  private readonly parseService = new ParseService();

  public importFromText<T extends Path<any>>(text: string): ImportResult<T> {
    const result = this.parseService.parse<T>(text);
    if (Maybe.isSuccess(result)) {
      return {
        paths: result.value.paths,
        message: { type: "success", text: result.value.message.value },
      };
    } else {
      return {
        paths: [],
        message: { type: "error", text: result.error!.value },
      };
    }
  }

  public async importFromFile<T extends Path<any>>(
    file: File
  ): Promise<ImportResult<T>> {
    const text = await this.readFile(file);
    return this.importFromText<T>(text);
  }

  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
}
