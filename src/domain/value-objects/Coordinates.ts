import { CoordinatesException } from "../exceptions/CoordinatesException";

/**
 * Represents a geographic position with latitude and longitude coordinates.
 */
export class Coordinates {
  public readonly latitude: number;
  public readonly longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = this.validateLatitude(latitude);
    this.longitude = this.validateLongitude(longitude);
  }

  private validateLatitude(latitude: number): number {
    if (latitude < -90 || latitude > 90) {
      throw new CoordinatesException(
        `Latitude must be between -90 and 90 degrees, and it's ${latitude}`
      );
    }
    return latitude;
  }

  private validateLongitude(longitude: number): number {
    if (longitude < -180 || longitude > 180) {
      throw new CoordinatesException(
        `Longitude must be between -180 and 180 degrees, and it's ${longitude}`
      );
    }
    return longitude;
  }

  public equals(other: Coordinates): boolean {
    return (
      this.latitude === other.latitude && this.longitude === other.longitude
    );
  }

  public toString(): string {
    return `${this.latitude},${this.longitude}`;
  }
}
