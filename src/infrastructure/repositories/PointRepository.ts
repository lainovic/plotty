import { Point } from "../../domain/entities/Point";
import { LayerId } from "../../domain/value-objects/LayerId";
import { PointId } from "../../domain/value-objects/PointId";

export class PointRepository {
  private points: Map<PointId, Point> = new Map();
  private layerPoints: Map<LayerId, Set<PointId>> = new Map();

  public async save(point: Point, layerId?: LayerId): Promise<void> {
    this.points.set(point.id, point);
    if (layerId) this.addPointToLayer(point.id, layerId);
  }

  public async findById(id: PointId): Promise<Point | null> {
    return this.points.get(id) || null;
  }

  public async findByLayerId(layerId: LayerId): Promise<Point[]> {
    const pointIds = this.layerPoints.get(layerId) || new Set();
    return Array.from(pointIds)
      .map((id) => this.points.get(id))
      .filter((point): point is Point => point !== undefined);
  }

  public async delete(id: PointId): Promise<void> {
    const point = await this.findById(id);
    if (point) {
      this.points.delete(id);
      // Remove from layer mapping
      for (const [layerId, pointIds] of this.layerPoints.entries()) {
        if (pointIds.has(id)) {
          pointIds.delete(id);
          if (pointIds.size === 0) {
            this.layerPoints.delete(layerId);
          }
        }
      }
    }
  }

  public async update(point: Point): Promise<void> {
    if (this.points.has(point.id)) {
      this.points.set(point.id, point);
    }
  }

  public async addPointToLayer(
    pointId: PointId,
    layerId: LayerId
  ): Promise<void> {
    if (!this.layerPoints.has(layerId)) {
      this.layerPoints.set(layerId, new Set());
    }
    this.layerPoints.get(layerId)?.add(pointId);
  }

  public async removePointFromLayer(
    pointId: PointId,
    layerId: LayerId
  ): Promise<void> {
    this.layerPoints.get(layerId)?.delete(pointId);
  }
}
