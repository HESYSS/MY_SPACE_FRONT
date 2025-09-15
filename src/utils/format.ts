export const filterKeyMap: Record<string, string> = {
  // === Item ===
  deal: "deal", // аренда / продажа
  propertyType: "type", // apartment, house, etc.
  category: "category", // Житлова, Комерційна
  isNewBuilding: "isNewBuilding", // булево
  isOutOfCity: "isOutOfCity", // булево
  newbuildingName: "newbuildingName",

  // === Location ===
  city: "city",
  borough: "district", // админ. район
  districts: "borough", // бОро (подрайон города)
  county: "county", // для обл. районов
  street: "streets",
  streets: "street",
  streetType: "streetType",

  // === Metro ===
  metro: "metros.name", // массив станций метро
  metroDistance: "metros.distance", // диапазон расстояний

  // === Characteristic ===
  Поверх_from: "characteristics.floor_min",
  Поверх_to: "characteristics.floor_max",

  Поверховість_from: "characteristics.building_floors_min",
  Поверховість_to: "characteristics.building_floors_max",

  "Загальна площа_from": "characteristics.area_total_min",
  "Загальна площа_to": "characteristics.area_total_max",

  Площа_from: "characteristics.area_min",
  Площа_to: "characteristics.area_max",

  rooms: "characteristics.room_count", // массив комнат
  renovation: "characteristics.renovation", // опции ремонта

  // === Price ===
  Ціна_from: "prices.value_min",
  Ціна_to: "prices.value_max",

  Офіс: "Офіс",
  "Торгівельна площа": "Торгівельна площа",
  "Виробниче приміщення": "Виробниче приміщення",

  "Склад Складське приміщення": "Складське приміщення",
  "Ресторан, кафе Об’єкт сфери харчування": "Об'єкт сфери харчування",

  Магазин: "Магазин",

  СТО: "СТО",
  АЗС: "АЗС", // АЗС нет прямого соответствия, отнесем к "Інший об'єкт"
  Автомийка: "Автомийка",
  "Паркомісце/Гараж": "Паркування",
  "Окрема Будівля Ціла будівля": "Ціла будівля",
};
