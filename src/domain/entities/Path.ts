import { Coordinates } from "../value-objects/Coordinates";
import { PathId } from "../value-objects/PathId";

export class Path<T extends Coordinates> {
  readonly id: PathId;
  private name: string;
  points: T[];

  constructor(points: T[], name: string = "") {
    this.id = new PathId();
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
