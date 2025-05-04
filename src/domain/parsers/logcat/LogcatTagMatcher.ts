import { Optional } from "../../../shared/Optional";

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

  static getMatchingTag(tag: string): Optional<SupportedTag> {
    const matchingTag = supportedTags.find((supportedTag) =>
      tag.includes(supportedTag)
    );
    return matchingTag ? Optional.some(matchingTag) : Optional.none();
  }

  static isRoutePlanner(tag: string): boolean {
    return this.getMatchingTag(tag)
      .map((t) => t === "RoutePlanner")
      .getOrValue(false);
  }

  static isMapMatcher(tag: string): boolean {
    return this.getMatchingTag(tag)
      .map((t) => t === "MapMatcher")
      .getOrValue(false);
  }

  static isNavigation(tag: string): boolean {
    return this.getMatchingTag(tag)
      .map(
        (t) => t === "TomTomNavigation" || t === "DistanceAlongRouteCalculator"
      )
      .getOrValue(false);
  }

  // Predicate functions
  static readonly isRoutePlannerTag = (tag: string) => this.isRoutePlanner(tag);
  static readonly isMapMatcherTag = (tag: string) => this.isMapMatcher(tag);
  static readonly isNavigationTag = (tag: string) => this.isNavigation(tag);
}
