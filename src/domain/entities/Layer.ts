import { Color } from "../value-objects/Color";
import { LayerId } from "../value-objects/LayerId";
import { ListenerId } from "../value-objects/ListenerId";
import { Path } from "./Path";

export interface LayerChangeListener {
  readonly id: ListenerId;
  onLayerChange(layer: Layer<any>): void;
}

export class Layer<T extends Path<any>> {
  public readonly id: LayerId;
  private name: string;
  private color: Color;
  private visible: boolean;
  private path: T;
  private visibilityChangeListeners: LayerChangeListener[] = [];

  constructor(name: string, color: Color, path: T) {
    this.id = new LayerId();
    this.name = name;
    this.color = color;
    this.visible = true;
    this.path = path;
  }

  public equals(other: Layer<T>) {
    return this.id.equals(other.id);
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string) {
    if (this.name !== name) {
      this.name = name;
      this.notifyLayerChange();
    }
  }

  public getColor(): Color {
    return this.color;
  }

  public isVisible(): boolean {
    return this.visible;
  }

  public setVisible(visible: boolean) {
    if (this.visible !== visible) {
      this.visible = visible;
      this.notifyLayerChange();
    }
  }

  public toggleVisibility() {
    this.visible = !this.visible;
    this.notifyLayerChange();
  }

  public getPath(): T {
    return this.path;
  }

  public getPoints(): T[] {
    return [...this.path.points];
  }

  public addLayerChangeListener(listener: LayerChangeListener) {
    this.visibilityChangeListeners.push(listener);
  }

  public removeLayerChangeListener(listener: LayerChangeListener) {
    this.visibilityChangeListeners = this.visibilityChangeListeners.filter(
      (l) => l.id !== listener.id
    );
  }

  private notifyLayerChange() {
    this.visibilityChangeListeners.forEach((listener) =>
      listener.onLayerChange(this)
    );
  }
}
