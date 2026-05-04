import { Coordinates } from "../value-objects/Coordinates";
import { v4 as uuid } from "uuid";

export class Path<T extends Coordinates> {
  readonly id: string;
  private name: string;
  points: T[];

  constructor(points: T[], name: string = "") {
    this.id = uuid();
    this.points = points;
    this.name = name;
  }

  empty(): boolean {
    return this.points.length === 0;
  }

  public getName(): string {
    return this.name;
  }

  isNotEmpty(): boolean {
    return !this.empty();
  }
}

export type AnyPath = Path<Coordinates>;
