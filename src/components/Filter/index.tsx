import { useState, useEffect, useRef } from "react";
import styles from "./Filter.module.css";
import LocationModal from "./LocationModal/LocationModal";
import FiltersModal from "./FiltersModal/FiltersModal";
import { useTranslation } from "react-i18next";

interface FilterProps {
  isOutOfCity?: boolean;
  type?: string;
  deal: "Оренда" | "Продаж";
  onApply?: (filters: any) => void;
  onTypeChange?: (value: "Оренда" | "Продаж") => void;
}
const LOCATION_STORAGE_KEY = "locationFilters";
const OTHER_STORAGE_KEY = "otherFilters";
export default function Filter({
  isOutOfCity,
  type,
  deal,
  onApply,
}: FilterProps) {
  const { t } = useTranslation("common");
  const [searchValue, setSearchValue] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  // Локальные состояния для выбранных данных
  const [location, setLocation] = useState<any>(null);
  const [filters, setFilters] = useState<any>(null);
  const locationTriggerRef = useRef<HTMLInputElement>(null);
  // Управление модальным окном "Локация"
  const handleLocationSubmit = (locationFilters: any) => {
    console.log("Location filters submitted:", locationFilters);
    setLocation(locationFilters);
  };
  useEffect(() => {
    console.log("location changed", location);
    console.log("filters changed", filters);
    if (onApply) {
      onApply({
        location: location, // основной объект локации
        filters, // пустой объект для остальных фильтров
      });
    }
  }, [location, filters]);

  // Управление модальным окном "Фильтр"
  const handleFiltersSubmit = (appliedFilters: any) => {
    setFilters({ ...appliedFilters });

    setIsFiltersModalOpen(false);
  };
  return (
    <div className={styles.container}>
      {/* Контейнер для строки поиска и модальных окон */}
      <div className={styles.searchContainer}>
        <div className={styles.topPanel}>
          <input
            ref={locationTriggerRef}
            type="text"
            placeholder={t("search_placeholder")} // вместо "Пошук..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.input}
            onClick={() => setIsLocationModalOpen(true)}
          />

          <button
            onClick={() => setIsFiltersModalOpen(true)}
            className={styles.locationButton}
          >
            {t("filter_button") || "Фільтр"} {/* вместо "Фільтр" */}
          </button>
        </div>

        {/* Модальное окно локации */}
        <div
          className={
            isLocationModalOpen ? styles.modalOpen : styles.modalClosed
          }
        >
          <LocationModal
            isOutOfCity={isOutOfCity}
            onClose={() => setIsLocationModalOpen(false)}
            onSubmit={handleLocationSubmit}
          />
        </div>
      </div>

      <div
        className={isFiltersModalOpen ? styles.modalOpen : styles.modalClosed}
      >
        <FiltersModal
          type={type}
          currentDeal={deal}
          onClose={() => setIsFiltersModalOpen(false)}
          onSubmit={handleFiltersSubmit}
        />
      </div>
    </div>
  );
}
