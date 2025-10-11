"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./Filter.module.css";
import LocationModal from "./LocationModal/LocationModal";
import FiltersModal from "./FiltersModal/FiltersModal";
import { useTranslation } from "react-i18next";
import FilterIcon from "../../../public/icons/Frame154.png";

const LOCATION_STORAGE_KEY = "locationFilters";
const OTHER_STORAGE_KEY = "otherFilters";

export default function Filter({}) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(initialSearch);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const initialSort = searchParams.get("sort") || "none";
  const [sortOption, setSortOption] = useState(initialSort);

  const isOutOfCity = false;

  const [location, setLocation] = useState<any>(null);
  const [filters, setFilters] = useState<any>(null);
  const locationTriggerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (currentSearch !== searchValue) {
      setSearchValue(currentSearch);
    }
  }, [searchParams]);

  /**
   * Функция для обновления URL после нажатия кнопки "Поиск"
   */
  const handleSearchSubmit = () => {
    const params = new URLSearchParams(window.location.search);

    const trimmedSearchValue = searchValue.trim();

    // Сбрасываем страницу на первую при любом новом поиске/сбросе
    params.delete("page");

    // Если есть значение для поиска, устанавливаем его

    params.set("search", trimmedSearchValue);
    // Гарантируем, что мы используем push, так как URL изменился
    router.replace(`?${params.toString()}`);
    return;
  };

  /**
   * Обработка нажатия Enter в поле поиска
   */
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const confirmKeys = ["Enter", "Go", "Search", "Done", "Next"];

    if (confirmKeys.includes(e.key)) {
      e.preventDefault(); // чтобы не срабатывало стандартное поведение (например, переход фокуса)
      handleSearchSubmit();
    }
  };

  const handleLocationSubmit = (locationFilters: any) => {
    setLocation(locationFilters);
  };

  const handleFiltersSubmit = (appliedFilters: any) => {
    setFilters({ ...appliedFilters });
    setIsFiltersModalOpen(false);
  };

  // 👇 когда меняется сортировка → обновляем URL
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOption(value);

    const params = new URLSearchParams(window.location.search);
    if (value === "none") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    // пушим новый урл без перезагрузки
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <div className={styles.topPanel}>
          <div className={styles.searchInputWrapper}>
            <input
              ref={locationTriggerRef}
              type="text"
              placeholder={t("search_placeholder")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className={styles.input}
              onClick={() => setIsLocationModalOpen(true)}
            />
            <button
              className={styles.searchButton}
              onClick={handleSearchSubmit}
            >
              {t("search_button")}
            </button>
          </div>

          {/* 👇 Сортировка */}
          <div className={styles.sortWrapper}>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className={styles.sortSelect}
            >
              <option value="none">{t("sort_label") || "Сортувати..."}</option>
              <option value="newest">
                {t("sort_newest") || "Спочатку нові"}
              </option>
              <option value="oldest">
                {t("sort_oldest") || "Спочатку старі"}
              </option>
              <option value="price_asc">
                {t("sort_price_asc") || "Спочатку дешевші"}
              </option>
              <option value="price_desc">
                {t("sort_price_desc") || "Спочатку дорожчі"}
              </option>
            </select>
          </div>

          <button
            onClick={() => setIsFiltersModalOpen(true)}
            className={styles.filterButton}
          >
            <img
              src={FilterIcon.src}
              alt="Фільтр"
              className={styles.filterIcon}
            />
            <span>{t("filter_button") || "Фільтр"}</span>
          </button>
        </div>

        <div
          className={
            isLocationModalOpen ? styles.modalOpen : styles.modalClosed
          }
        >
          <LocationModal
            isOutOfCity={isOutOfCity}
            onClose={() => setIsLocationModalOpen(false)}
            onSubmit={handleLocationSubmit}
            triggerRef={locationTriggerRef}
          />
        </div>
      </div>

      <div
        className={isFiltersModalOpen ? styles.modalOpen : styles.modalClosed}
      >
        <FiltersModal onClose={() => setIsFiltersModalOpen(false)} />
      </div>
    </div>
  );
}
