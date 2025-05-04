import { Coordinates } from "../value-objects/Coordinates";
import { PathId } from "../value-objects/PathId";

export class Path<T extends Coordinates> {
  id: PathId;
  name: string;
  points: T[];

  constructor(points: T[], name: string = "") {
    this.id = new PathId();
    this.points = points;
    this.name = name;
  }

  empty(): boolean {
    return this.points.length === 0;
  }

  isNotEmpty(): boolean {
    return !this.empty();
  }
}
