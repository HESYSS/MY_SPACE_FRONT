import { filterKeyMap } from "./format";

export function standardizeFilters(filters: Record<string, any>) {
  const result: Record<string, any> = {};

  Object.entries(filters).forEach(([key, value]) => {
    // Маппинг ключа
    const mappedKey = filterKeyMap[key] || key;

    // Если value тоже есть в маппинге (для типов объектов)
    if (typeof value === "string" && filterKeyMap[value]) {
      result[mappedKey] = filterKeyMap[value];
    } else if (Array.isArray(value)) {
      // Для массивов: маппим каждый элемент, если есть соответствие
      result[mappedKey] = value.map((v) =>
        filterKeyMap[v] ? filterKeyMap[v] : v
      );
    } else {
      result[mappedKey] = value;
    }
  });

  return result;
}
