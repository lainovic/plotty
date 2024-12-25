export class TileProvider {
  protected name: string;
  protected attribution: string;
  protected url: string;
  protected maxZoom: number;

  constructor(name: string, attribution: string, url: string, maxZoom: number) {
    this.name = name;
    this.attribution = attribution;
    this.url = url;
    this.maxZoom = maxZoom;
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

  getMaxZoom(): number {
    return this.maxZoom;
  }
}

export class AuthTileProvider extends TileProvider {
  private localStorageKey: string;
  private apiKey: string | null;

  constructor(
    name: string,
    attribution: string,
    url: string,
    localStorageKey: string,
    maxZoom: number
  ) {
    super(name, attribution, url, maxZoom);
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
