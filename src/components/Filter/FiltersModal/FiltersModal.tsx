import { useState, useEffect } from "react";
import styles from "./FiltersModal.module.css";
import { CATEGORY_TYPES, FILTERS_BY_TYPE } from "./filtersConfig";

interface FiltersModalProps {
  onClose: () => void;
  onSubmit: (filters: any) => void;
}

const STORAGE_KEY = "otherFilters";
const CURRENCY_KEY = "currency";

export default function FiltersModal({ onClose, onSubmit }: FiltersModalProps) {
  const [category, setCategory] =
    useState<keyof typeof CATEGORY_TYPES>("Житлова");
  const [propertyType, setPropertyType] = useState<string>(
    CATEGORY_TYPES["Житлова"][0]
  );
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [currency, setCurrency] = useState<"UAH" | "USD">("UAH");

  // Загружаем сохраненные фильтры и валюту
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setFilters(parsed);
      if (parsed.category) setCategory(parsed.category);
      if (parsed.propertyType) setPropertyType(parsed.propertyType);
    }
    const savedCurrency = localStorage.getItem(CURRENCY_KEY);
    if (savedCurrency === "USD") setCurrency("USD");
  }, []);

  const handleCurrencyToggle = (newCurrency: "UAH" | "USD") => {
    setCurrency(newCurrency);
    localStorage.setItem(CURRENCY_KEY, newCurrency);
  };

  const handleInputChange = (filterName: string, value: any) => {
    setFilters((prev) => {
      const updated = { ...prev, [filterName]: value };

      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (!saved[category]) saved[category] = {};
      saved[category][propertyType] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      return updated;
    });
  };

  const handleSubmit = () => {
    onSubmit({
      category,
      propertyType,
      ...filters,
      currency, // передаем выбранную валюту
    });
  };

  const resetFilters = () => {
    setFilters({});
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (!saved[category]) saved[category] = {};
    saved[category][propertyType] = {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Заголовок + кнопка переключения валюты */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Фільтри</h2>
        </div>

        {/* Категорія */}
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>Категорія</div>
          <div className={styles.categoryToggle}>
            {Object.keys(CATEGORY_TYPES).map((cat) => (
              <button
                key={cat}
                className={`${styles.categoryButton} ${
                  category === cat ? styles.active : ""
                }`}
                onClick={() => {
                  setCategory(cat as keyof typeof CATEGORY_TYPES);
                  setPropertyType(CATEGORY_TYPES[cat][0]);
                  const saved = JSON.parse(
                    localStorage.getItem(STORAGE_KEY) || "{}"
                  );
                  setFilters(saved[cat]?.[CATEGORY_TYPES[cat][0]] || {});
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Тип нерухомості */}
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>Тип нерухомості</div>
          <div className={styles.propertyTypeToggle}>
            {CATEGORY_TYPES[category].map((type) => (
              <button
                key={type}
                className={`${styles.propertyButton} ${
                  propertyType === type ? styles.active : ""
                }`}
                onClick={() => {
                  setPropertyType(type);
                  const saved = JSON.parse(
                    localStorage.getItem(STORAGE_KEY) || "{}"
                  );
                  setFilters(saved[category]?.[type] || {});
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        {/* Оренда / Продаж */}
        {/* Оренда / Продаж */}
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>Тип угоди</div>
          <div className={styles.propertyTypeToggle}>
            {["Оренда", "Продаж"].map((deal) => (
              <button
                key={deal}
                className={`${styles.propertyButton} ${
                  filters.deal == deal ? styles.active : ""
                }`}
                onClick={() => handleInputChange("deal", deal)}
              >
                {deal}
              </button>
            ))}
          </div>
        </div>

        {/* Динамічні фільтри */}
        <div className={styles.dynamicFilters}>
          {FILTERS_BY_TYPE[propertyType]?.map((filter) => (
            <div key={filter} className={styles.filterGroup}>
              <label className={styles.filterLabel}>{filter}</label>

              {[
                "Ціна",
                "Поверх",
                "Поверховість",
                "Загальна площа",
                "Площа",
                "№ Будинку",
              ].includes(filter) ? (
                <div className={styles.inputRange}>
                  <input
                    type="text"
                    placeholder="Від"
                    value={filters[`${filter}_from`] || ""}
                    onChange={(e) =>
                      handleInputChange(`${filter}_from`, e.target.value)
                    }
                    className={styles.rangeInput}
                  />
                  <span className={styles.rangeSeparator}>до</span>
                  <input
                    type="text"
                    placeholder="До"
                    value={filters[`${filter}_to`] || ""}
                    onChange={(e) =>
                      handleInputChange(`${filter}_to`, e.target.value)
                    }
                    className={styles.rangeInput}
                  />
                  {filter === "Ціна" && (
                    <div className={styles.currencyContainer}>
                      <button
                        onClick={() => handleCurrencyToggle("UAH")}
                        className={`${styles.currencyButtonPrice} ${
                          currency === "UAH" ? styles.active : ""
                        }`}
                      >
                        Грн
                      </button>
                      <span>/</span>
                      <button
                        onClick={() => handleCurrencyToggle("USD")}
                        className={`${styles.currencyButtonPrice} ${
                          currency === "USD" ? styles.active : ""
                        }`}
                      >
                        USD
                      </button>
                    </div>
                  )}
                  {filter === "Загальна площа" && <span>м²</span>}
                </div>
              ) : filter === "Кіл.кімнат" ? (
                <div className={styles.multiSelect}>
                  {[1, 2, 3, 4, 5, "6+"].map((room) => (
                    <button
                      key={room}
                      className={`${styles.roomButton} ${
                        filters.rooms?.includes(room) ? styles.active : ""
                      }`}
                      onClick={() =>
                        handleInputChange(
                          "rooms",
                          filters.rooms?.includes(room)
                            ? filters.rooms.filter((r: any) => r !== room)
                            : [...(filters.rooms || []), room]
                        )
                      }
                    >
                      {room}
                    </button>
                  ))}
                </div>
              ) : filter === "Ремонт" ? (
                <div className={styles.multiSelect}>
                  {[
                    "без ремонту",
                    "після будівельників",
                    "ремонт",
                    "євроремонт",
                    "дизайнерський",
                    "з оздобленням",
                  ].map((option) => (
                    <button
                      key={option}
                      className={`${styles.optionButton} ${
                        filters.renovation?.includes(option)
                          ? styles.active
                          : ""
                      }`}
                      onClick={() =>
                        handleInputChange(
                          "renovation",
                          filters.renovation?.includes(option)
                            ? filters.renovation.filter(
                                (o: any) => o !== option
                              )
                            : [...(filters.renovation || []), option]
                        )
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder={`Введіть ${filter}`}
                  value={filters[filter] || ""}
                  onChange={(e) => handleInputChange(filter, e.target.value)}
                  className={styles.rangeInput}
                />
              )}
            </div>
          ))}
        </div>

        {/* Кнопки */}
        <div className={styles.modalActions}>
          <button onClick={resetFilters} className={styles.resetButton}>
            Скинути
          </button>
          <button onClick={handleSubmit} className={styles.showResultsButton}>
            Показати результати
          </button>
        </div>
      </div>
    </div>
  );
}
