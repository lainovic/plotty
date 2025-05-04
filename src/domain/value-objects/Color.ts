import { ColorException } from "../exceptions/ColorException";

export class Color {
  public readonly hue: number; // Hue (0-360)
  public readonly saturation: number; // Saturation (0-100)
  public readonly lightness: number; // Lightness (0-100)
  public readonly alpha: number; // Alpha (0-1)

  constructor(h: number, s: number, l: number, a: number = 1) {
    this.hue = this.validateHue(h);
    this.saturation = this.validatePercentage(s);
    this.lightness = this.validatePercentage(l);
    this.alpha = this.validateAlpha(a);
  }

  public static fromHex(hexColor: string): Color {
    const hex = hexColor.replace("#", "");
    if (!/^[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hex)) {
      throw new ColorException(`Invalid hex color format: ${hexColor}`);
    }

    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return new Color(
      Math.round(h * 360),
      Math.round(s * 100),
      Math.round(l * 100),
      a
    );
  }

  private validateHue(h: number): number {
    if (h < 0 || h > 360) {
      throw new ColorException(`Hue must be between 0 and 360, but it's ${h}`);
    }

    return h;
  }

  private validatePercentage(value: number): number {
    if (value < 0 || value > 100) {
      throw new ColorException(
        `Percentage must be between 0 and 100, but it's ${value}`
      );
    }

    return value;
  }

  private validateAlpha(a: number): number {
    if (a < 0 || a > 1) {
      throw new ColorException(`Alpha must be between 0 and 1, but it's ${a}`);
    }

    return a;
  }

  public lighten(amount: number): Color {
    return new Color(
      this.hue,
      this.saturation,
      this.lightness + amount,
      this.alpha
    );
  }

  public darken(amount: number): Color {
    return new Color(
      this.hue,
      this.saturation,
      this.lightness - amount,
      this.alpha
    );
  }

  public saturate(amount: number): Color {
    return new Color(
      this.hue,
      this.saturation + amount,
      this.lightness,
      this.alpha
    );
  }

  public desaturate(amount: number): Color {
    return new Color(
      this.hue,
      this.saturation - amount,
      this.lightness,
      this.alpha
    );
  }

  public equals(other: Color): boolean {
    return (
      this.hue === other.hue &&
      this.saturation === other.saturation &&
      this.lightness === other.lightness &&
      this.alpha === other.alpha
    );
  }

  public toHsla(): string {
    return `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;
  }

  public toHex(): string {
    const rgba = this.toRGBA();
    const [r, g, b] = rgba.match(/\d+/g)!.map(Number);

    const toHex = (x: number) => x.toString(16).padStart(2, "0");
    const alphaHex = Math.round(this.alpha * 255)
      .toString(16)
      .padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
  }

  public toRGBA(): string {
    const h = this.hue / 360;
    const s = this.saturation / 100;
    const l = this.lightness / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
      b * 255
    )}, ${this.alpha})`;
  }

  public withAlpha(alpha: number): Color {
    return new Color(this.hue, this.saturation, this.lightness, alpha);
  }
}
