import { useState, useEffect } from "react";
import styles from "./FiltersModal.module.css";
import { CATEGORY_TYPES, FILTERS_BY_TYPE } from "./filtersConfig";
import i18n from "i18n";
import { useTranslation } from "react-i18next";

interface FiltersModalProps {
  onClose: () => void;
  onSubmit: (filters: any) => void;
}

const STORAGE_KEY = "otherFilters";
const CURRENCY_KEY = "currency";

export default function FiltersModal({ onClose, onSubmit }: FiltersModalProps) {
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language;
  const [category, setCategory] =
    useState<keyof typeof CATEGORY_TYPES>("Житлова");
  const [propertyType, setPropertyType] = useState<string>(
    CATEGORY_TYPES["Житлова"][lang as "en" | "ua"][0]
  );
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [currency, setCurrency] = useState<"UAH" | "USD">("USD");

  // Загружаем сохраненные фильтры и валюту
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log("Loaded saved filters:", parsed);
      setFilters(parsed);
      if (parsed.category) setCategory(parsed.category);
      if (parsed.propertyType) setPropertyType(parsed.propertyType);

      const savedCurrency = localStorage.getItem(CURRENCY_KEY);
      if (savedCurrency === "USD") setCurrency("USD");

      onSubmit({
        ...parsed,
        // передаем выбранную валюту
      });
    }
  }, []);
  useEffect(() => {
    console.log("Filters changed:", filters);
  }, [filters]);
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
          <h2 className={styles.modalTitle}>{t("filter_button")}</h2>
        </div>

        {/* Категорія */}
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>{t("category")}</div>
          <div className={styles.categoryToggle}>
            {Object.keys(CATEGORY_TYPES).map((catUa, index) => {
              const catEn = Object.keys(CATEGORY_TYPES)[index];
              return (
                <button
                  key={catUa}
                  className={`${styles.categoryButton} ${
                    category === catUa ? styles.active : ""
                  }`}
                  onClick={() => {
                    localStorage.removeItem(STORAGE_KEY);
                    setCategory(catUa as keyof typeof CATEGORY_TYPES);
                    setPropertyType(CATEGORY_TYPES[catUa]["ua"][0]);
                    const saved = JSON.parse(
                      localStorage.getItem(STORAGE_KEY) || "{}"
                    );
                    setFilters(
                      saved[catUa]?.[CATEGORY_TYPES[catUa]["ua"][0]] || {}
                    );
                  }}
                >
                  {t(`categoryKeys.${catUa}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Тип нерухомості */}
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>{t("propertyType")}</div>
          <div className={styles.propertyTypeToggle}>
            {CATEGORY_TYPES[category]["ua"].map((typeUa, index) => {
              const typeEn =
                CATEGORY_TYPES[category][lang as "en" | "ua"][index];
              return (
                <button
                  key={typeUa}
                  className={`${styles.propertyButton} ${
                    propertyType === typeUa ? styles.active : ""
                  }`}
                  onClick={() => {
                    localStorage.removeItem(STORAGE_KEY);
                    setPropertyType(typeUa);
                    const saved = JSON.parse(
                      localStorage.getItem(STORAGE_KEY) || "{}"
                    );
                    setFilters(saved[category]?.[typeUa] || {});
                  }}
                >
                  {typeEn}
                </button>
              );
            })}
          </div>
        </div>
        {/* Оренда / Продаж */}
        {/* Оренда / Продаж */}
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>{t("dealType")}</div>
          <div className={styles.propertyTypeToggle}>
            {["Оренда", "Продаж"].map((deal) => (
              <button
                key={deal}
                className={`${styles.propertyButton} ${
                  filters.deal == deal ? styles.active : ""
                }`}
                onClick={() => handleInputChange("deal", deal)}
              >
                {t(deal)}
              </button>
            ))}
          </div>
        </div>

        {/* Динамічні фільтри */}
        <div className={styles.dynamicFilters}>
          {FILTERS_BY_TYPE[propertyType]?.["ua"].map((filterUa, index) => {
            const filterEn =
              FILTERS_BY_TYPE[propertyType][lang as "en" | "ua"][index];
            return (
              <div key={filterUa} className={styles.filterGroup}>
                <label className={styles.filterLabel}>{filterEn}</label>

                {[
                  "Ціна",
                  "Поверх",
                  "Поверховість",
                  "Загальна площа",
                  "Площа",
                  "№ Будинку",
                ].includes(filterUa) ? (
                  <div className={styles.inputRange}>
                    <input
                      type="text"
                      placeholder={t("Від")}
                      value={filters[`${filterUa}_from`] || ""}
                      onChange={(e) =>
                        handleInputChange(`${filterUa}_from`, e.target.value)
                      }
                      className={styles.rangeInput}
                    />
                    <span className={styles.rangeSeparator}>{t("до")}</span>
                    <input
                      type="text"
                      placeholder={t("До")}
                      value={filters[`${filterUa}_to`] || ""}
                      onChange={(e) =>
                        handleInputChange(`${filterUa}_to`, e.target.value)
                      }
                      className={styles.rangeInput}
                    />
                    {filterUa === "Ціна" && (
                      <div className={styles.currencyContainer}>
                        <button
                          onClick={() => handleCurrencyToggle("UAH")}
                          className={`${styles.currencyButtonPrice} ${
                            currency === "UAH" ? styles.active : ""
                          }`}
                        >
                          {t("Грн")}
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
                    {filterUa === "Загальна площа" && (
                      <span>{t("squareMeters")}</span>
                    )}
                  </div>
                ) : filterUa === "Кіл.кімнат" ? (
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
                ) : filterUa === "Ремонт" ? (
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
                        {t(option)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder={`Введіть ${filterEn}`}
                    value={filters[filterUa] || ""}
                    onChange={(e) =>
                      handleInputChange(filterUa, e.target.value)
                    }
                    className={styles.rangeInput}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Кнопки */}
        <div className={styles.modalActions}>
          <button onClick={resetFilters} className={styles.resetButton}>
            {t("reset")} {/* вместо "Скинути" */}
          </button>
          <button onClick={handleSubmit} className={styles.showResultsButton}>
            {t("showResults") /* вместо "Показати результати" */}
          </button>
        </div>
      </div>
    </div>
  );
}
