import { Path } from "../../domain/entities/Path";
import { ParseService } from "../../domain/services/ParseService";
import { PathCreatedEvent } from "../../domain/events/PathEvents";
import { EventPublisher } from "../../domain/events/EventPublisher";
import { DomainEvent } from "../../domain/events/DomainEvent";
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
  constructor(private readonly eventPublisher: EventPublisher) {}

  public importFromText<T extends Path<any>>(text: string): ImportResult<T> {
    const result = this.parseService.parse<T>(text);
    if (Maybe.isSuccess(result)) {
      const paths = result.value.paths;
      const message = result.value.message;

      this.postEvents(paths);

      return {
        paths,
        message: {
          type: "success",
          text: message.value,
        },
      };
    } else {
      const errorMessage = result.error!.value;

      return {
        paths: [],
        message: {
          type: "error",
          text: errorMessage,
        },
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

  private postEvents<T extends Path<any>>(paths: T[]) {
    const events: DomainEvent[] = paths.map(
      (path) => new PathCreatedEvent(path)
    );
    events.forEach((event) => {
      this.eventPublisher.publish(event);
    });
  }
}
