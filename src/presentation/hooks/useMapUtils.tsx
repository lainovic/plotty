import { useMap } from "react-leaflet";
import { getBoundingBox } from "../../domain/utils/bounding-box-utils";
import React from "react";
import { Coordinates } from "../../domain/value-objects/Coordinates";

export const useMapUtils = () => {
  const map = useMap();

  /**
   * Calculates the bounding box of the path and flies the map to that bounding box,
   * centering and zooming the map to fit the path.
   *
   * @param path - The path that was clicked.
   */
  const flyToBoundingBox = React.useCallback(
    <T extends Coordinates>(points: T[]) => {
      if (points.length == 0) return;

      if (points.length === 1) {
        const point = points[0];
        map.flyTo([point.latitude, point.longitude], map.getZoom(), {
          duration: 0.5,
        });
        return;
      }

      const { minLatitude, maxLatitude, minLongitude, maxLongitude } =
        getBoundingBox(points);
      map.flyToBounds(
        [
          [minLatitude, minLongitude],
          [maxLatitude, maxLongitude],
        ],
        {
          duration: 0.5,
          maxZoom: map.getZoom(),
        }
      );
    },
    []
  );

  const zoomToBoundingBox = React.useCallback(
    <T extends Coordinates>(points: T[]) => {
      if (points.length == 0) return;

      if (points.length === 1) {
        const point = points[0];
        map.flyTo([point.latitude, point.longitude], map.getMaxZoom(), {
          duration: 0.5,
        });
        return;
      }

      const { minLatitude, maxLatitude, minLongitude, maxLongitude } =
        getBoundingBox(points);
      map.fitBounds(
        [
          [minLatitude, minLongitude],
          [maxLatitude, maxLongitude],
        ],
        {
          duration: 0.5,
        }
      );
    },
    []
  );

  /**
   * Flies the map to the specified coordinates at the given zoom level.
   * The map will smoothly animate to the new position.
   *
   * @param coordinates - The target coordinates to fly to
   * @param zoomLevel - The zoom level to set (defaults to 15 if not specified)
   */
  const flyToCoordinates = React.useCallback(
    <T extends Coordinates>(coordinates: T, zoomLevel: number = 15) => {
      map.flyTo([coordinates.latitude, coordinates.longitude], zoomLevel, {
        duration: 0.5,
      });
    },
    []
  );

  return {
    flyToBoundingBox,
    zoomToBoundingBox,
    flyToCoordinates,
  };
};
