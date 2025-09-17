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
const typeMap: Record<string, string> = {
  residential: "Житлова",
  commercial: "Комерційна",
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
      if (Array.isArray(val)) {
        // Если val — массив простых значений
        return;
      } else if (typeof val === "object" && val !== null && key === "polygon") {
        // Если val — объект (например массив массивов)
        const flattened = Object.values(val).map((v: any) =>
          Array.isArray(v) ? v.join(",") : String(v)
        );
        params[key] = [flattened.join(",")]; // объединяем всё в одну строку
      }
    } else {
      params[key] = String(val);
    }
  });
  return params;
}

export default function CatalogPage() {
  const router = useRouter();
  const { deal, category, region } = router.query;
  const isOutOfCity = region === "kyiv" ? false : true;
  const type = typeMap[typeof category === "string" ? category : "Житлова"];

  const { i18n, t } = useTranslation("common");
  const lang = i18n.language;

  const isMobileOrTablet = useMediaQuery({ maxWidth: 1300 });
  const [showMap, setShowMap] = useState(false);

  const currentDeal = typeof deal === "string" ? deal : "Оренда";
  const [propertyType, setPropertyType] = useState<"Оренда" | "Продаж">(
    currentDeal === "rent" || currentDeal === "Оренда" ? "Оренда" : "Продаж"
  );
  console.log(
    "Router query:",
    router.query,
    isOutOfCity,
    type,
    currentDeal,
    region
  );
  console.log("propertyType", propertyType, currentDeal);
  const [properties, setProperties] = useState<any[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 9;
  const [totalCount, setTotalCount] = useState(0);

  const [locationFilter, setLocationFilter] = useState<any>();
  const [otherFilters, setOtherFilters] = useState<any>();

  const handleApply = (location: any, filters: any) => {
    console.log("Applying filters:", { location, filters });
    setLocationFilter({ ...location });
    setOtherFilters({ ...filters });
    setPage(1);
  };

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const standardizedLocation = standardizeFilters(locationFilter);
        const standardizedFilters = standardizeFilters(otherFilters);
        console.log("fetching with filters:", {
          standardizedLocation,
          standardizedFilters,
        });

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...buildQueryFromFilters(standardizedLocation),
          ...buildQueryFromFilters(standardizedFilters),
          lang: lang,
        });

        const backendUrl = process.env.REACT_APP_API_URL;
        console.log("Fetching with params:", params.toString());

        const res = await fetch(`${backendUrl}/items?${params}`, {
          signal: controller.signal,
        });
        const data = await res.json();

        setProperties(data.items);
        setTotalCount(data.total);
        console.log("Fetched properties:", data.total);
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Запрос отменён из-за нового фильтра/страницы");
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }, 500); // задержка 500мс

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [page, locationFilter, otherFilters, lang]);

  useEffect(() => {
    const controller = new AbortController(); // для отмены запроса если фильтры изменились раньше чем задержка закончилась
    const timeout = setTimeout(async () => {
      try {
        const standardizedLocation = standardizeFilters(locationFilter);
        const standardizedFilters = standardizeFilters(otherFilters);

        console.log("1");
        const params = new URLSearchParams({
          lang: lang,

          ...buildQueryFromFilters(standardizedLocation),
          ...buildQueryFromFilters(standardizedFilters),
        });

        console.log("Fetching all with params:", params.toString());
        const backendUrl = process.env.REACT_APP_API_URL;
        const res = await fetch(`${backendUrl}/items/coords?${params}`, {
          signal: controller.signal,
        });

        const data = await res.json();
        setAllProperties(data);
        console.log("Fetched all properties for map:", data);
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Запрос отменён из-за нового фильтра");
        } else {
          console.error(err);
        }
      }
    }, 50); // задержка 500мс

    return () => {
      clearTimeout(timeout);
      controller.abort(); // отменяем предыдущий запрос
    };
  }, [locationFilter, otherFilters]);

  const containerClass = showMap
    ? styles.catalogMapOnly
    : styles.catalogContainer;

  return (
    <div className={containerClass}>
      <div className={styles.leftColumn}>
        <Filter
          isOutOfCity={isOutOfCity}
          type={type}
          currentDeal={currentDeal}
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
        className={`${styles.rightColumn} ${showMap ? styles.mapVisible : ""}`}
      >
        {isMobileOrTablet &&
          showMap && ( // 👈 Показываем кнопку только на мобильных/планшетах и когда карта активна
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
