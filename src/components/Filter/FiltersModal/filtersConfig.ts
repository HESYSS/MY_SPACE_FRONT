// filtersConfig.ts

// Категории и типы
export const CATEGORY_TYPES: Record<string, { en: string[]; ua: string[] }> = {
  Комерційна: {
    en: [
      "Office",
      "Retail space",
      "Industrial premises",
      "Warehouse",
      "Restaurant, cafe",
      "Hotel room",
      "Shop",
      "Entire building",
      "Car service",
      "Gas station",
      "Car wash",
      "Parking space/Garage",
    ],
    ua: [
      "Офіс",
      "Торгівельна площа",
      "Виробниче приміщення",
      "Склад Складське приміщення",
      "Ресторан, кафе Об’єкт сфери харчування",
      "Готель Готельний номер",
      "Магазин",
      "Окрема Будівля Ціла будівля",
      "СТО",
      "АЗС",
      "Автомийка",
      "Паркомісце/Гараж",
    ],
  },
  Житлова: {
    en: ["Apartment", "House"],
    ua: ["Квартира", "Будинок"],
  },
};

// Фильтры по типу недвижимости (без локации)
export const FILTERS_BY_TYPE: Record<string, { en: string[]; ua: string[] }> = {
  Офіс: {
    en: ["Price", "Floor", "Floors", "Total area"],
    ua: ["Ціна", "Поверх", "Поверховість", "Загальна площа"],
  },
  "Торгівельна площа": {
    en: ["Price", "Floor", "Floors", "Total area"],
    ua: ["Ціна", "Поверх", "Поверховість", "Загальна площа"],
  },
  "Виробниче приміщення": {
    en: ["Price", "Floor", "Floors", "Total area"],
    ua: ["Ціна", "Поверх", "Поверховість", "Загальна площа"],
  },
  "Склад Складське приміщення": {
    en: ["Price", "Floor", "Floors", "Total area"],
    ua: ["Ціна", "Поверх", "Поверховість", "Загальна площа"],
  },
  "Ресторан, кафе Об’єкт сфери харчування": {
    en: ["Price", "Floor", "Floors", "Total area"],
    ua: ["Ціна", "Поверх", "Поверховість", "Загальна площа"],
  },
  "Готель Готельний номер": {
    en: ["Price", "Floor", "Floors", "Total area"],
    ua: ["Ціна", "Поверх", "Поверховість", "Загальна площа"],
  },
  Магазин: {
    en: ["Price", "Floor", "Floors", "Total area"],
    ua: ["Ціна", "Поверх", "Поверховість", "Загальна площа"],
  },
  "Окрема Будівля Ціла будівля": {
    en: ["Price", "Floor", "Floors", "Total area"],
    ua: ["Ціна", "Поверх", "Поверховість", "Загальна площа"],
  },
  СТО: { en: ["Price", "Total area"], ua: ["Ціна", "Загальна площа"] },
  АЗС: { en: ["Price", "Total area"], ua: ["Ціна", "Загальна площа"] },
  Автомийка: { en: ["Price", "Total area"], ua: ["Ціна", "Загальна площа"] },
  "Паркомісце/Гараж": { en: ["Price", "Area"], ua: ["Ціна", "Площа"] },
  Квартира: {
    en: ["Price", "Rooms", "Renovation", "Floor", "Total area"],
    ua: ["Ціна", "Кіл.кімнат", "Ремонт", "Поверх", "Загальна площа"],
  },
  Будинок: {
    en: ["Price", "Floors", "Total area", "Rooms", "Renovation"],
    ua: ["Ціна", "Поверховість", "Загальна площа", "Кіл.кімнат", "Ремонт"],
  },
};
