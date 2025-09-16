import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Filter from "@/components/Filter";
import MapWrapper from "@/components/Map/MapWrapper";
import PropertyList from "./PropertyList";
import styles from "./CatalogPage.module.css";
import { standardizeFilters } from "@/utils/filterMap";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

const dealMap: Record<string, string> = {
  rent: "Оренда",
  sale: "Продаж",
};

const reverseDealMap: Record<string, string> = {
  Оренда: "rent",
  Продаж: "sale",
};

// Сериализация фильтров в URL-параметры
function buildQueryFromFilters(
  filters: Record<string, any>
): Record<string, string> {
  const params: Record<string, string> = {};
  Object.entries(filters).forEach(([key, val]) => {
    if (val == null || val === "" || (Array.isArray(val) && val.length === 0))
      return;
    if (Array.isArray(val)) {
      params[key] = val.join(",");
    } else if (typeof val === "object") {
      return;
    } else {
      params[key] = String(val);
    }
  });
  return params;
}

export default function CatalogPage() {
  const router = useRouter();
  const { type } = router.query;
  const { i18n, t } = useTranslation("common");
  const lang = i18n.language;

  const isMobileOrTablet = useMediaQuery({ maxWidth: 1300 });
  const [showMap, setShowMap] = useState(false);

  const currentDeal = typeof type === "string" ? type : "Оренда";
  const [propertyType, setPropertyType] = useState<"Оренда" | "Продаж">(
    currentDeal === "rent" || currentDeal === "Оренда" ? "Оренда" : "Продаж"
  );

  const [properties, setProperties] = useState<any[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 9;
  const [totalCount, setTotalCount] = useState(0);

  const [locationFilter, setLocationFilter] = useState<any>(() => {
    const saved = localStorage.getItem("locationFilters");
    return saved ? JSON.parse(saved) : {};
  });
  const [otherFilters, setOtherFilters] = useState<any>(() => {
    const saved = localStorage.getItem("otherFilters");
    return saved ? JSON.parse(saved) : {};
  });

  const handleApply = (location: any, filters: any) => {
    setLocationFilter({ ...location });
    setOtherFilters({ ...filters });
    setPage(1);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const standardizedLocation = standardizeFilters(locationFilter);
        const standardizedFilters = standardizeFilters(otherFilters);

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...buildQueryFromFilters(standardizedLocation),
          ...buildQueryFromFilters(standardizedFilters),
          lang: lang,
        });
        const backendUrl = process.env.REACT_APP_API_URL;
        console.log("Fetching with params:", backendUrl);
        const res = await fetch(`${backendUrl}/items?${params}`);
        const data = await res.json();

        setProperties(data.items);
        setTotalCount(data.total);
        console.log("Fetched properties:", data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page, locationFilter, otherFilters, lang]);

  useEffect(() => {
    async function fetchAll() {
      try {
        const standardizedLocation = standardizeFilters(locationFilter);
        const standardizedFilters = standardizeFilters(otherFilters);

        const params = new URLSearchParams({
          ...buildQueryFromFilters(standardizedLocation),
          ...buildQueryFromFilters(standardizedFilters),
        });

        const backendUrl = process.env.REACT_APP_API_URL;
        const res = await fetch(`${backendUrl}/items/coords?${params}`);

        const data = await res.json();

        setAllProperties(data);
        console.log("Fetched all properties for map:", data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchAll();
  }, [locationFilter, otherFilters]);

  const containerClass = showMap ? styles.catalogMapOnly : styles.catalogContainer;

  return (
    <div className={containerClass}>
      <div className={styles.leftColumn}>
        <Filter
          type={propertyType}
          onApply={(appliedFilters: any) => {
            const { location = {}, filters = {} } = appliedFilters;
            handleApply({ ...location }, { ...filters });
          }}
        />

        {isMobileOrTablet && (
          <button 
            className={styles.toggleMapButton} 
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? t("show_list") : t("show_map")}
          </button>
        )}

        <div className={styles.listContainer}>
          <PropertyList
            properties={properties}
            loading={loading}
            page={page}
            setPage={setPage}
            totalCount={totalCount}
            pageSize={limit}
          />
        </div>
      </div>

      <div 
        className={`${styles.rightColumn} ${showMap ? styles.mapVisible : ''}`}
      >
        {isMobileOrTablet && showMap && ( // 👈 Показываем кнопку только на мобильных/планшетах и когда карта активна
          <button 
            className={styles.closeMapButton} 
            onClick={() => setShowMap(false)} // 👈 Кнопка закрывает карту
          >
            {t("close_map")}
          </button>
        )}
        <MapWrapper
          properties={allProperties}
          locationFilters={locationFilter}
          onChangeFilters={(newFilters) => setLocationFilter(newFilters)}
        />
      </div>
    </div>
  );
}