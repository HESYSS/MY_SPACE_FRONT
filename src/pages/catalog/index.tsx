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
        return;
      } else if (typeof val === "object" && val !== null && key === "polygon") {
        const flattened = Object.values(val).map((v: any) =>
          Array.isArray(v) ? v.join(",") : String(v)
        );
        params[key] = flattened.join(",");
      }
    } else {
      params[key] = String(val);
    }
  });
  return params;
}

export default function CatalogPage() {
  const router = useRouter();
  const { deal, category, region, sort, search, ...restQuery } = router.query;
  const isOutOfCity = region === "kyiv" ? false : true;
  const type = typeMap[typeof category === "string" ? category : "Житлова"];

  const { i18n, t } = useTranslation("common");
  const lang = i18n.language;

  const isMobileOrTablet = useMediaQuery({ maxWidth: 1300 });
  const [showMap, setShowMap] = useState(false);

  const currentDeal = typeof deal === "string" ? deal : "Оренда";

  const [properties, setProperties] = useState<any[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalCount, setTotalCount] = useState(0);

  const [locationFilter, setLocationFilter] = useState<any>();
  const [otherFilters, setOtherFilters] = useState<any>();

  const [searchValue, setSearchValue] = useState<string>(
    typeof search === "string" ? search : ""
  );
  const [sortOption, setSortOption] = useState<string>(
    typeof sort === "string" ? sort : "none"
  );

  useEffect(() => {
    if (!router.isReady) return;

    const dealFromRoute = router.query.deal || router.query.slug || "Оренда";

    let otherFilters: Record<string, any> = {};
    let locationFilters: Record<string, any> = {};

    if (typeof router.query.otherfilters === "string") {
      try {
        const decoded = decodeURIComponent(router.query.otherfilters);
        otherFilters = JSON.parse(decoded);
      } catch (e) {
        console.warn("Ошибка парсинга otherfilters", e);
      }
    }
    if (typeof router.query.locationfilters === "string") {
      try {
        const decoded = decodeURIComponent(router.query.locationfilters);
        locationFilters = JSON.parse(decoded);
      } catch (e) {
        console.warn("Ошибка парсинга locationfilters", e);
      }
    }

    setOtherFilters((prev: any) =>
      JSON.stringify(prev) === JSON.stringify(otherFilters)
        ? prev
        : otherFilters
    );
    setLocationFilter((prev: any) =>
      JSON.stringify(prev) === JSON.stringify(locationFilters)
        ? prev
        : locationFilters
    );

    if (typeof router.query.search === "string")
      setSearchValue(router.query.search);
    if (
      typeof router.query.search === "string" ||
      (typeof router.query.sort === "string" &&
        router.query.sort !== sortOption)
    ) {
      setPage(1);
    }

    if (typeof router.query.sort === "string") setSortOption(router.query.sort);
  }, [router.isReady, router.asPath]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
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

        if (searchValue) params.set("q", searchValue);
        if (sortOption && sortOption !== "none") params.set("sort", sortOption);
        const backendUrl = process.env.REACT_APP_API_URL;

        const res = await fetch(`${backendUrl}/items?${params}`, {
          signal: controller.signal,
        });
        const data = await res.json();

        setProperties(data.items);
        setTotalCount(data.total);
      } catch (err: any) {
        if (err.name === "AbortError") {
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [page, locationFilter, otherFilters, lang, searchValue, sortOption]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const standardizedLocation = standardizeFilters(locationFilter);
        const standardizedFilters = standardizeFilters(otherFilters);

        const params = new URLSearchParams({
          lang: lang,

          ...buildQueryFromFilters(standardizedLocation),
          ...buildQueryFromFilters(standardizedFilters),
        });
        if (searchValue) params.set("q", searchValue);
        if (sortOption && sortOption !== "none") params.set("sort", sortOption);
        const backendUrl = process.env.REACT_APP_API_URL;
        const res = await fetch(`${backendUrl}/items/coords?${params}`, {
          signal: controller.signal,
        });

        const data = await res.json();
        setAllProperties(data);
      } catch (err: any) {
        if (err.name === "AbortError") {
        } else {
          console.error(err);
        }
      }
    }, 50);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [locationFilter, otherFilters, searchValue, sortOption]);

  const containerClass = showMap
    ? styles.catalogMapOnly
    : styles.catalogContainer;

  return (
    <div className={containerClass}>
      <div className={styles.leftColumn}>
        <Filter />

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
          showMap && (
            <button
              className={styles.closeMapButton}
              onClick={() => setShowMap(false)} 
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
