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
    const hasSearchInUrl = params.has("search");
    const trimmedSearchValue = searchValue.trim();
    
    // Сбрасываем страницу на первую при любом новом поиске/сбросе
    params.delete("page");

    // Если есть значение для поиска, устанавливаем его
    if (trimmedSearchValue) {
      params.set("search", trimmedSearchValue);
      // Гарантируем, что мы используем push, так как URL изменился
      router.push(`?${params.toString()}`);
      return; 
    }

    // --- ✅ ИСПРАВЛЕНИЕ: БЛОК ПРИНУДИТЕЛЬНОГО СБРОСА ---

    // 1. Если поле поиска пустое, и в URL ЕСТЬ параметр 'search', просто удаляем его.
    if (!trimmedSearchValue && hasSearchInUrl) {
      params.delete("search");
      // Это изменит URL, Next.js выполнит навигацию
      router.push(`?${params.toString()}`);
      return;
    } 
    
    // 2. Если поле поиска пустое, и в URL НЕТ параметра 'search',
    // Next.js не выполнит навигацию, так как URL не изменится.
    // Чтобы ПРИНУДИТЕЛЬНО вызвать запрос, мы добавим временный параметр
    // и сразу же его удалим.
    if (!trimmedSearchValue && !hasSearchInUrl) {
      // Добавляем фиктивный, изменяющийся параметр (например, для сброса)
      params.set("reset", Date.now().toString()); 
      const tempUrl = `?${params.toString()}`;
      
      // Удаляем его сразу после получения URL-строки
      params.delete("reset"); 
      const finalUrl = `?${params.toString()}`;

      // Сначала вызываем навигацию с фиктивным параметром (чтобы URL изменился)
      router.replace(tempUrl);
      
      // Сразу же вызываем навигацию обратно на чистый URL (чтобы сбросить его)
      // Этот второй вызов router.replace гарантирует, что мы останемся на чистом URL.
      // Важно: если `router.replace` не помогает, замените его на `router.push`.
      // В большинстве случаев `router.replace` работает лучше, чтобы не засорять историю.
      router.replace(finalUrl);
      
      // ВАРИАНТ 2 (более простой, но может быть менее надежный):
      // const paramsWithoutSearch = new URLSearchParams(window.location.search);
      // paramsWithoutSearch.delete("search");
      // paramsWithoutSearch.delete("page");
      // paramsWithoutSearch.set("ts", Date.now().toString()); // Добавляем метку времени
      // router.replace(`?${paramsWithoutSearch.toString()}`);
      
      return;
    }
    
    // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
    
    // Fallback: если ничего не произошло, просто делаем push
    router.push(`?${params.toString()}`);
  };

  /**
   * Обработка нажатия Enter в поле поиска
   */
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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