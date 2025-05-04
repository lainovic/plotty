import { Layer } from "../../domain/entities/Layer";
import { Color } from "../../domain/value-objects/Color";
import { LayerId } from "../../domain/value-objects/LayerId";
import { LayerRepository } from "../../infrastructure/repositories/LayerRepository";
import { Path } from "../../domain/entities/Path";
import { EventPublisher } from "../../domain/events/EventPublisher";
import {
  LayerCreated,
  LayerRemoved,
  LayerVisibilityToggled,
} from "../../domain/events/LayerEvents";

export class LayerService {
  constructor(
    private readonly layerRepository: LayerRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  public async createLayer<T extends Path<any>>(
    name: string,
    color: Color,
    path: T
  ): Promise<Layer<T>> {
    const layer = new Layer<T>(name, color, path);
    await this.layerRepository.save(layer);

    this.publishLayerCreatedEvent(layer);

    return layer;
  }

  public async getLayerById<T extends Path<any>>(
    id: LayerId
  ): Promise<Layer<T> | null> {
    const layer = await this.layerRepository.findById(id);
    return layer as Layer<T> | null;
  }

  public async getAllLayers(): Promise<Layer<any>[]> {
    return await this.layerRepository.findAll();
  }

  public async updateLayer<T extends Path<any>>(
    layer: Layer<T>
  ): Promise<void> {
    await this.layerRepository.update(layer);
  }

  public async deleteLayer(id: LayerId): Promise<void> {
    await this.layerRepository.delete(id);
    this.publishLayerRemovedEvent(id);
  }

  public async toggleLayerVisibility<T extends Path<any>>(
    id: LayerId
  ): Promise<void> {
    const layer = await this.getLayerById<T>(id);
    if (layer) {
      layer.toggleVisibility();
      await this.layerRepository.update(layer);
      this.publishLayerVisibilityToggledEvent(id, layer.isVisible());
    }
  }

  private publishLayerCreatedEvent<T extends Path<any>>(layer: Layer<T>) {
    const event = new LayerCreated(layer.id, layer.getName(), layer.getColor());
    this.eventPublisher.publish(event);
  }

  private publishLayerRemovedEvent(layerId: LayerId) {
    const event = new LayerRemoved(layerId);
    this.eventPublisher.publish(event);
  }

  private publishLayerVisibilityToggledEvent(
    id: LayerId,
    isLayerVisible: boolean
  ) {
    const event = new LayerVisibilityToggled(id, isLayerVisible);
    this.eventPublisher.publish(event);
  }
}
