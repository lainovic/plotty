import { Layer } from "../../domain/entities/Layer";
import { LayerId } from "../../domain/value-objects/LayerId";
import { Path } from "../../domain/entities/Path";

export class LayerRepository {
  private layers: Map<LayerId, Layer<any>> = new Map();

  public async save<T extends Path<any>>(layer: Layer<T>): Promise<void> {
    this.layers.set(layer.id, layer);
  }

  public async findById<T extends Path<any>>(
    id: LayerId
  ): Promise<Layer<T> | null> {
    const layer = this.layers.get(id);
    return layer as Layer<T> | null;
  }

  public async findAll(): Promise<Layer<any>[]> {
    return Array.from(this.layers.values());
  }

  public async delete(id: LayerId): Promise<void> {
    this.layers.delete(id);
  }

  public async update<T extends Path<any>>(layer: Layer<T>): Promise<void> {
    if (this.layers.has(layer.id)) {
      this.layers.set(layer.id, layer);
    }
  }
}
