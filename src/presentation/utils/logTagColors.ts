export type LogTagCategory = "routing" | "mapMatching" | "guidance" | "navigation";

export interface LogTagColor {
  category: LogTagCategory;
  point: string;
  tag: string;
  bg: string;
}

const colors: Record<LogTagCategory, LogTagColor> = {
  routing:     { category: "routing",     point: "#c0392b", tag: "#c0392b", bg: "#fde8e8" },
  mapMatching: { category: "mapMatching", point: "#e67e22", tag: "#d35400", bg: "#fef3e2" },
  guidance:    { category: "guidance",    point: "#8e44ad", tag: "#8e44ad", bg: "#f5eafb" },
  navigation:  { category: "navigation",  point: "#2980b9", tag: "#2980b9", bg: "#e8f4fd" },
};

export function getLogTagColor(tag: string): LogTagColor {
  if (/Planner|Replan/i.test(tag))   return colors.routing;
  if (/Match|Project/i.test(tag))    return colors.mapMatching;
  if (/Guidance|Warning/i.test(tag)) return colors.guidance;
  return colors.navigation;
}
