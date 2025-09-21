import { useState, useEffect, useRef } from "react";
import styles from "./Filter.module.css";
import LocationModal from "./LocationModal/LocationModal";
import FiltersModal from "./FiltersModal/FiltersModal";
import { useTranslation } from "react-i18next";
import FilterIcon from '../../../public/icons/Frame154.png'; 

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
  
  const handleLocationSubmit = (locationFilters: any) => {
    console.log("Location filters submitted:", locationFilters);
    setLocation(locationFilters);
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

  const handleFiltersSubmit = (appliedFilters: any) => {
    setFilters({ ...appliedFilters });
    setIsFiltersModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <div className={styles.topPanel}>
          {/* ИЗМЕНЕНИЕ: Обернули input и кнопку поиска в новый div */}
          <div className={styles.searchInputWrapper}>
            <input
              ref={locationTriggerRef}
              type="text"
              placeholder={t("search_placeholder")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.input}
              onClick={() => setIsLocationModalOpen(true)}
            />
            {/* ИЗМЕНЕНИЕ: Кнопка поиска теперь внутри обертки */}
            <button className={styles.searchButton}>
              {t("search_button")}
            </button>
          </div>
          
          {/* ИЗМЕНЕНИЕ: В кнопку фильтров добавлена иконка и надпись */}
          <button
            onClick={() => setIsFiltersModalOpen(true)}
            className={styles.filterButton}
          >
            <img src={FilterIcon.src} alt="Фільтр" className={styles.filterIcon} />
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