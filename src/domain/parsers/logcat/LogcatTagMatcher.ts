export const supportedTags = [
  "MapMatcher",
  "TomTomNavigation",
  "DistanceAlongRouteCalculator",
  "RoutePlanner",
] as const;

export type SupportedTag = (typeof supportedTags)[number];

export class LogcatTagMatcher {
  static isSupported(tag: string): boolean {
    return supportedTags.some((supportedTag) => tag.includes(supportedTag));
  }

  static getMatchingTag(tag: string): SupportedTag | null {
    return supportedTags.find((supportedTag) => tag.includes(supportedTag)) ?? null;
  }

  static isRoutePlanner(tag: string): boolean {
    return this.getMatchingTag(tag) === "RoutePlanner";
  }

  static isMapMatcher(tag: string): boolean {
    return this.getMatchingTag(tag) === "MapMatcher";
  }

  static isNavigation(tag: string): boolean {
    const t = this.getMatchingTag(tag);
    return t === "TomTomNavigation" || t === "DistanceAlongRouteCalculator";
  }

  // Predicate functions
  static readonly isRoutePlannerTag = (tag: string) => this.isRoutePlanner(tag);
  static readonly isMapMatcherTag = (tag: string) => this.isMapMatcher(tag);
  static readonly isNavigationTag = (tag: string) => this.isNavigation(tag);
}
