import { filterKeyMap } from "./format";

export function standardizeFilters(filters: Record<string, any>) {
  const result: Record<string, any> = {};

  Object.entries(filters).forEach(([key, value]) => {
    const mappedKey = filterKeyMap[key] || key;

    if (typeof value === "string" && filterKeyMap[value]) {
      result[mappedKey] = filterKeyMap[value];
    } else if (Array.isArray(value)) {
      result[mappedKey] = value.map((v) =>
        filterKeyMap[v] ? filterKeyMap[v] : v
      );
    } else {
      result[mappedKey] = value;
    }
  });

  return result;
}
