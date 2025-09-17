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
    en: ["Floor", "Floors", "Total area"],
    ua: ["Поверх", "Поверховість", "Загальна площа"],
  },
  "Торгівельна площа": {
    en: ["Floor", "Floors", "Total area"],
    ua: ["Поверх", "Поверховість", "Загальна площа"],
  },
  "Виробниче приміщення": {
    en: ["Floor", "Floors", "Total area"],
    ua: ["Поверх", "Поверховість", "Загальна площа"],
  },
  "Склад Складське приміщення": {
    en: ["Floor", "Floors", "Total area"],
    ua: ["Поверх", "Поверховість", "Загальна площа"],
  },
  "Ресторан, кафе Об’єкт сфери харчування": {
    en: ["Floor", "Floors", "Total area"],
    ua: ["Поверх", "Поверховість", "Загальна площа"],
  },
  "Готель Готельний номер": {
    en: ["Floor", "Floors", "Total area"],
    ua: ["Поверх", "Поверховість", "Загальна площа"],
  },
  Магазин: {
    en: ["Floor", "Floors", "Total area"],
    ua: ["Поверх", "Поверховість", "Загальна площа"],
  },
  "Окрема Будівля Ціла будівля": {
    en: ["Floor", "Floors", "Total area"],
    ua: ["Поверх", "Поверховість", "Загальна площа"],
  },
  СТО: { en: ["Total area"], ua: ["Загальна площа"] },
  АЗС: { en: ["Total area"], ua: ["Загальна площа"] },
  Автомийка: { en: ["Total area"], ua: ["Загальна площа"] },
  "Паркомісце/Гараж": { en: ["Area"], ua: ["Площа"] },
  Квартира: {
    en: ["Rooms", "Renovation", "Floor", "Total area"],
    ua: ["Кіл.кімнат", "Ремонт", "Поверх", "Загальна площа"],
  },
  Будинок: {
    en: ["Floors", "Total area", "Rooms", "Renovation"],
    ua: ["Поверховість", "Загальна площа", "Кіл.кімнат", "Ремонт"],
  },
};
