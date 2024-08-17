/**
 * Provides a base class for tile providers that can be used to fetch map tiles.
 *
 * TODO: add max zoom level?
 *
 * The `TileProvider` class encapsulates the common functionality for fetching map tiles, including the tile URL and attribution information.
 */
export class TileProvider {
  protected name: string;
  protected attribution: string;
  protected url: string;

  constructor(name: string, attribution: string, url: string) {
    this.name = name;
    this.attribution = attribution;
    this.url = url;
  }

  getAttribution(): string {
    return this.attribution;
  }
  getUrl(): string {
    return this.url;
  }
  toString(): string {
    return this.name;
  }
}

export class AuthTileProvider extends TileProvider {
  private localStorageKey: string;
  private apiKey: string | null;

  constructor(name: string, attribution: string, url: string, localStorageKey: string) {
    super(name, attribution, url);
    this.localStorageKey = localStorageKey;
    this.apiKey = localStorage.getItem(localStorageKey);
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    localStorage.setItem(this.localStorageKey, apiKey);
  }

  getUrl(): string {
    return `${this.url}${
      this.apiKey
        ? `${this.url.includes("?") ? "&" : "?"}key=${this.apiKey}`
        : ""
    }`;
  }
}
