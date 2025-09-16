import { useState, useEffect } from "react";
import styles from "./FiltersModal.module.css";
import { CATEGORY_TYPES, FILTERS_BY_TYPE } from "./filtersConfig";
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
  const [currency, setCurrency] = useState<"UAH" | "USD">("UAH");

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
      currency,
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
        <div className={styles.header}>
          <h2 className={styles.title}>{t("Фильтры")}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>

        <div className={styles.section}>
          <div className={styles.label}>{t("Категория")}</div>
          <div className={styles.categoryToggle}>
            {Object.keys(CATEGORY_TYPES).map((catUa, index) => (
              <button
                key={catUa}
                className={`${styles.button} ${
                  category === catUa ? styles.active : ""
                }`}
                onClick={() => {
                  setCategory(catUa as keyof typeof CATEGORY_TYPES);
                  setPropertyType(
                    CATEGORY_TYPES[catUa][lang as "en" | "ua"][0]
                  );
                  const saved = JSON.parse(
                    localStorage.getItem(STORAGE_KEY) || "{}"
                  );
                  setFilters(saved[catUa]?.[propertyType] || {});
                }}
              >
                {category === catUa && (
                  <svg
                    className={styles.checkIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
                {t(`categoryKeys.${catUa}`)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.label}>{t("Тип услуги")}</div>
          <div className={styles.dealToggle}>
            {["Продаж", "Оренда"].map((deal) => (
              <button
                key={deal}
                className={`${styles.button} ${
                  filters.deal === deal ? styles.active : ""
                }`}
                onClick={() => handleInputChange("deal", deal)}
              >
                {filters.deal === deal && (
                  <svg
                    className={styles.checkIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
                {t(deal)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.label}>{t("Цена")}</div>
          <div className={styles.priceContainer}>
            <div className={styles.priceInputGroup}>
              <input
                type="text"
                placeholder={t("от")}
                value={filters.price_from || ""}
                onChange={(e) => handleInputChange("price_from", e.target.value)}
                className={`${styles.inputField} ${filters.price_from ? styles.filled : ''}`}
              />
              <span className={styles.separator}>–</span>
              <input
                type="text"
                placeholder={t("до")}
                value={filters.price_to || ""}
                onChange={(e) => handleInputChange("price_to", e.target.value)}
                className={`${styles.inputField} ${filters.price_to ? styles.filled : ''}`}
              />
            </div>
            <div className={styles.currencyToggle}>
              <button
                onClick={() => handleCurrencyToggle("UAH")}
                className={`${styles.currencyButton} ${
                  currency === "UAH" ? styles.active : ""
                }`}
              >
                {t("Грн")}
              </button>
              <button
                onClick={() => handleCurrencyToggle("USD")}
                className={`${styles.currencyButton} ${
                  currency === "USD" ? styles.active : ""
                }`}
              >
                USD
              </button>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.label}>{t("Характеристики")}</div>
          <div className={styles.dynamicFilters}>
            {FILTERS_BY_TYPE[propertyType]?.["ua"].map((filterUa, index) => {
              const filterEn = FILTERS_BY_TYPE[propertyType][lang as "en" | "ua"][index];
              
              if (["Ціна", "Поверх", "Поверховість", "Загальна площа", "Площа", "№ Будинку"].includes(filterUa)) {
                const nameFrom = `${filterUa}_from`;
                const nameTo = `${filterUa}_to`;
                return (
                  <div key={filterUa} className={styles.inputRangeGroup}>
                    <label className={styles.inputRangeLabel}>{t(filterUa)}</label>
                    <div className={styles.inputRange}>
                      <input
                        type="text"
                        placeholder={t("от")}
                        value={filters[nameFrom] || ""}
                        onChange={(e) => handleInputChange(nameFrom, e.target.value)}
                        className={`${styles.inputField} ${filters[nameFrom] ? styles.filled : ''}`}
                      />
                      <span className={styles.separator}>–</span>
                      <input
                        type="text"
                        placeholder={t("до")}
                        value={filters[nameTo] || ""}
                        onChange={(e) => handleInputChange(nameTo, e.target.value)}
                        className={`${styles.inputField} ${filters[nameTo] ? styles.filled : ''}`}
                      />
                      {(filterUa === "Загальна площа" || filterUa === "Площа") && (
                        <span className={styles.unit}>м²</span>
                      )}
                    </div>
                  </div>
                );
              } else if (filterUa === "Кіл.кімнат") {
                return (
                  <div key={filterUa} className={styles.inputRangeGroup}>
                    <label className={styles.inputRangeLabel}>{t("Кількість кімнат")}</label>
                    <div className={styles.roomButtons}>
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
                  </div>
                );
              } else if (filterUa === "Ремонт") {
                  return (
                      <div key={filterUa} className={styles.inputRangeGroup}>
                          <label className={styles.inputRangeLabel}>{t("Ремонт")}</label>
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
                                      className={`${styles.roomButton} ${
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
                      </div>
                  );
              } else {
                return null;
              }
            })}
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={resetFilters} className={styles.resetButton}>
            {t("Скинути")}
          </button>
          <button onClick={handleSubmit} className={styles.submitButton}>
            {t("Показати результати")}
          </button>
        </div>
      </div>
    </div>
  );
}
