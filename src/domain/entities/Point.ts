import { Coordinates } from "../value-objects/Coordinates";
import { PointId } from "../value-objects/PointId";

export class Point {
  public readonly id: PointId;
  private coordinates: Coordinates;
  private name: string;
  private description: string;

  constructor(
    coordinates: Coordinates,
    name: string,
    description: string = ""
  ) {
    this.id = new PointId();
    this.coordinates = coordinates;
    this.name = name;
    this.description = description;
  }

  public equals(other: Point) {
    return this.id === other.id;
  }

  public getCoordinates(): Coordinates {
    return this.coordinates;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public updateName(name: string): void {
    this.name = name;
  }

  public updateDescription(description: string): void {
    this.description = description;
  }

  public moveTo(coordinates: Coordinates): void {
    this.coordinates = coordinates;
  }
}
