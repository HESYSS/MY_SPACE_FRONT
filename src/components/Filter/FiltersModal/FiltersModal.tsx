import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./FiltersModal.module.css";
import { CATEGORY_TYPES, FILTERS_BY_TYPE } from "./filtersConfig";
import { useTranslation } from "react-i18next";

interface FiltersModalProps {
  onClose: () => void;
}
const typeMap: Record<string, string> = {
  residential: "Житлова",
  commercial: "Комерційна",
  Житлова: "Житлова",
  Комерційна: "Комерційна",
};

export default function FiltersModal({ onClose }: FiltersModalProps) {
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language == "uk" ? "ua" : i18n.language;
  const router = useRouter();
  const { restQuery } = router.query;

  const [category, setCategory] =
    useState<keyof typeof CATEGORY_TYPES>("Житлова");
  const [propertyType, setPropertyType] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [currency, setCurrency] = useState<"UAH" | "USD">("USD");
  // Инициализация из URL
  useEffect(() => {
    if (!router.isReady) return;

    let parsedOtherFilters: Record<string, any> = {};
    if (typeof router.query.otherfilters === "string") {
      try {
        // 1. Декодируем URI
        const decoded = decodeURIComponent(router.query.otherfilters);
        // 2. Парсим JSON
        parsedOtherFilters = JSON.parse(decoded);
      } catch (e) {
        console.warn("Ошибка парсинга otherfilters", e);
      }
    }
    setFilters(parsedOtherFilters);
    setCategory(parsedOtherFilters.category || "Житлова");
    setPropertyType(parsedOtherFilters.type || "");
  }, [router.isReady, router.query.otherfilters]);
  // Обновление URL при изменении фильтра
  const updateUrl = (newFilters: Record<string, any>) => {
    const query: Record<string, string> = {
      ...router.query,
      otherfilters: JSON.stringify(newFilters),
    };

    // Убираем пустые значения
    Object.keys(query).forEach((key) => {
      if (
        query[key] === "" ||
        query[key] == null ||
        (typeof query[key] === "string" && query[key] === "{}")
      ) {
        delete query[key];
      }
    });

    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  const handleCurrencyToggle = (newCurrency: "UAH" | "USD") => {
    setCurrency(newCurrency);
    // Не обновляем URL сразу — сохраняем в локальном состоянии
  };

  const handleInputChange = (filterName: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleSubmit = () => {
    const otherFilters = {
      ...filters,
      category,
      type: propertyType,
      currency,
    };
    onClose();
    router.push(
      {
        pathname: router.pathname,
        query: {
          otherfilters: JSON.stringify(otherFilters),
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const resetFilters = () => {
    setFilters({}); // очищаем все фильтры
    updateUrl({}); // очищаем otherfilters в URL
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Заголовок + кнопка переключения валюты */}
        <div className={styles.header}>
          <h2 className={styles.title}>{t("filter_button")}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>

        {/* Категорія */}
        <div className={styles.section}>
          <div className={styles.label}>{t("category")}</div>
          <div className={styles.categoryToggle}>
            {Object.keys(CATEGORY_TYPES).map((catUa, index) => {
              const catEn = Object.keys(CATEGORY_TYPES)[index];
              return (
                <button
                  key={catUa}
                  className={`${styles.button} ${
                    category === catUa ? styles.active : ""
                  }`}
                  onClick={() => {
                    const newCategory = catUa as keyof typeof CATEGORY_TYPES;
                    const newType = CATEGORY_TYPES[newCategory]["ua"][0];

                    // Локально обновляем состояние
                    setCategory(newCategory);
                    setPropertyType(newType);
                    setFilters({}); // сбросить остальные фильтры

                    // Не трогаем URL, обновим его только при handleSubmit
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
              );
            })}
          </div>
        </div>

        {/* Тип нерухомості */}
        <div className={styles.section}>
          <div className={styles.label}>{t("propertyType")}</div>
          <div className={styles.dealToggle}>
            {CATEGORY_TYPES[category]["ua"].map((typeUa, index) => {
              const typeEn =
                CATEGORY_TYPES[category][lang as "en" | "ua"][index];
              return (
                <button
                  key={typeUa}
                  className={`${styles.button} ${
                    propertyType === typeUa ? styles.active : ""
                  }`}
                  onClick={() => {
                    const newType = typeUa;

                    // Локально обновляем состояние
                    setPropertyType(newType);
                    setFilters({}); // сброс остальных фильтров

                    // URL не трогаем, он будет обновляться при handleSubmit
                  }}
                >
                  {propertyType === typeUa && (
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
                  {typeEn}
                </button>
              );
            })}
          </div>
        </div>
        {/* Оренда / Продаж */}
        {/* Оренда / Продаж */}
        <div className={styles.section}>
          <div className={styles.label}>{t("dealType")}</div>
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
                value={filters[`Ціна_from`] || ""}
                onChange={(e) => handleInputChange("Ціна_from", e.target.value)}
                className={`${styles.inputField} ${
                  filters[`Ціна_from`] ? styles.filled : ""
                }`}
              />
              <span className={styles.separator}>–</span>
              <input
                type="text"
                placeholder={t("до")}
                value={filters[`Ціна_to`] || ""}
                onChange={(e) => handleInputChange("Ціна_to", e.target.value)}
                className={`${styles.inputField} ${
                  filters[`Ціна_to`] ? styles.filled : ""
                }`}
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
                  <div className={styles.priceInputGroup}>
                    <input
                      type="text"
                      placeholder={t("Від")}
                      value={filters[`${filterUa}_from`] || ""}
                      onChange={(e) =>
                        handleInputChange(`${filterUa}_from`, e.target.value)
                      }
                      className={`${styles.inputField} ${
                        filters[`${filterUa}_from`] ? styles.filled : ""
                      }`}
                    />
                    <span className={styles.separator}>–</span>
                    <input
                      type="text"
                      placeholder={t("До")}
                      value={filters[`${filterUa}_to`] || ""}
                      onChange={(e) =>
                        handleInputChange(`${filterUa}_to`, e.target.value)
                      }
                      className={`${styles.inputField} ${
                        filters[`${filterUa}_to`] ? styles.filled : ""
                      }`}
                    />
                    {filterUa === "Ціна" && (
                      <div className={styles.currencyToggle}>
                        <button
                          onClick={() => handleCurrencyToggle("UAH")}
                          className={`${styles.currencyButton} ${
                            currency === "UAH" ? styles.active : ""
                          }`}
                        >
                          {t("Грн")}
                        </button>
                        <span>/</span>
                        <button
                          onClick={() => handleCurrencyToggle("USD")}
                          className={`${styles.currencyButton} ${
                            currency === "USD" ? styles.active : ""
                          }`}
                        >
                          USD
                        </button>
                      </div>
                    )}
                    {filterUa === "Загальна площа" && (
                      <span className={styles.unit}>{t("squareMeters")}</span>
                    )}
                  </div>
                ) : filterUa === "Кіл.кімнат" ? (
                  <div key={filterUa} className={styles.inputRangeGroup}>
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
        <div className={styles.footer}>
          <button onClick={resetFilters} className={styles.resetButton}>
            {t("reset")} {/* вместо "Скинути" */}
          </button>
          <button onClick={handleSubmit} className={styles.submitButton}>
            {t("showResults") /* вместо "Показати результати" */}
          </button>
        </div>
      </div>
    </div>
  );
}
