import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Filter from "@/components/Filter";
import MapWrapper from "@/components/Map/MapWrapper";
import PropertyList from "./PropertyList";
import styles from "./CatalogPage.module.css"; // Импортируем стили
import { standardizeFilters } from "@/utils/filterMap";

const dealMap: Record<string, string> = {
  rent: "Оренда",
  sale: "Продаж",
};

const reverseDealMap: Record<string, string> = {
  Оренда: "rent",
  Продаж: "sale",
};

// Универсальная функция сериализации фильтров
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
      // Игнорируем вложенные объекты
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

  const currentDeal = typeof type === "string" ? type : "Оренда";
  const [propertyType, setPropertyType] = useState<"Оренда" | "Продаж">(
    currentDeal === "rent" || currentDeal === "Оренда" ? "Оренда" : "Продаж"
  );

  const [properties, setProperties] = useState<any[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 6;

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

  // PropertyList
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
        });

        const res = await fetch(`http://localhost:3001/items?${params}`);
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page, locationFilter, otherFilters]);

  // MapWrapper
  useEffect(() => {
    async function fetchAll() {
      try {
        const standardizedLocation = standardizeFilters(locationFilter);
        const standardizedFilters = standardizeFilters(otherFilters);

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...buildQueryFromFilters(standardizedLocation),
          ...buildQueryFromFilters(standardizedFilters),
        });

        const res = await fetch(`http://localhost:3001/items/coords?${params}`);
        const data = await res.json();
        setAllProperties(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchAll();
  }, [locationFilter, otherFilters]);

  return (
    <div className={styles.catalogContainer}>
      <div className={styles.leftColumn}>
        <div>
          <h1 className={styles.catalogTitle}>
            Каталог: {propertyType && `— ${propertyType}`}
          </h1>

          <Filter
            type={propertyType}
            onApply={(appliedFilters: any) => {
              const { location = {}, filters = {} } = appliedFilters;
              handleApply({ ...location }, { ...filters });
            }}
          />
        </div>

        <div className={styles.listContainer}>
          <PropertyList properties={properties} loading={loading} />
        </div>
      </div>

      <div className={styles.rightColumn}>
        <MapWrapper properties={allProperties} />
      </div>
    </div>
  );
}
