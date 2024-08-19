import { Path } from "../../types/paths";

export default class Layer {
  path: Path;
  name: string;
  constructor(path: Path, name: string | null = null) {
    this.path = path;
    if (name === null) {
      name = path.name;
    }
    this.name = name;
  }

  shouldRender(): boolean {
    return this.path.isNotEmpty();
  }
}
