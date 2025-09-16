import { useState, useEffect, useRef } from "react";
import styles from "./Filter.module.css";
import LocationModal from "./LocationModal/LocationModal";
import FiltersModal from "./FiltersModal/FiltersModal";
import { useTranslation } from "react-i18next";

interface FilterProps {
  type?: "Оренда" | "Продаж";
  onApply?: (filters: any) => void;
  onTypeChange?: (value: "Оренда" | "Продаж") => void;
}
const LOCATION_STORAGE_KEY = "locationFilters";
const OTHER_STORAGE_KEY = "otherFilters";

export default function Filter({ type, onApply }: FilterProps) {
  const { t } = useTranslation("common");
  const [searchValue, setSearchValue] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  // Создаем ref для элемента-триггера
  const locationTriggerRef = useRef<HTMLInputElement>(null);

  // Локальные состояния для выбранных данных
  const [location, setLocation] = useState<any>(null);
  const [filters, setFilters] = useState<any>(null);

  useEffect(() => {
    // восстановление локации
    const savedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
    console.log("Saved location from storage:", savedLocation);
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    }

    // восстановление других фильтров
    const savedFilters = localStorage.getItem(OTHER_STORAGE_KEY);
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  }, []);

  // Управление модальным окном "Локация"
  const handleLocationSubmit = (locationFilters: any) => {
    console.log("Location filters submitted:", locationFilters);
    setLocation(locationFilters);
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationFilters));
  };

  useEffect(() => {
    console.log("location changed", location);
    console.log("filters changed", filters);
    if (onApply) {
      onApply({
        location: location,
        filters,
      });
    }
  }, [location, filters]);

  // Управление модальным окном "Фильтр"
  const handleFiltersSubmit = (appliedFilters: any) => {
    setFilters({ ...appliedFilters });
    localStorage.setItem(OTHER_STORAGE_KEY, JSON.stringify(appliedFilters));
    setIsFiltersModalOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Контейнер для строки поиска и модальных окон */}
      <div className={styles.searchContainer}>
        <div className={styles.topPanel}>
          {/* Привязываем ref к input */}
          <input
            ref={locationTriggerRef}
            type="text"
            placeholder={t("search_placeholder")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.input}
            onClick={() => setIsLocationModalOpen(true)}
          />

          <button
            onClick={() => setIsFiltersModalOpen(true)}
            className={styles.locationButton}
          >
            {t("filter_button") || "Фільтр"}
          </button>
        </div>

        {/* Модальное окно локации */}
        {isLocationModalOpen && (
          <LocationModal
            onClose={() => setIsLocationModalOpen(false)}
            onSubmit={handleLocationSubmit}
            triggerRef={locationTriggerRef} // Передаем ref в LocationModal
          />
        )}
      </div>

      <div
        className={isFiltersModalOpen ? styles.modalOpen : styles.modalClosed}
      >
        <FiltersModal
          onClose={() => setIsFiltersModalOpen(false)}
          onSubmit={handleFiltersSubmit}
        />
      </div>
    </div>
  );
}