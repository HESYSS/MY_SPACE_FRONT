"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SHORE_DISTRICTS,
  METRO_LINES,
} from "../LocationModal/locationFiltersConfig";
import { SearchModal } from "./SearchModal";

interface Tag {
  type: string;
  value: string;
  fullName?: string;
}

interface SearchBarProps {
  handleSearchSubmit: (value: string) => void;
  handleSearchKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string
  ) => void;
  openLocationModal: () => void;
}

export default function SearchBar({
  handleSearchSubmit,
  handleSearchKeyDown,
  openLocationModal,
}: SearchBarProps) {
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language;
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Новое состояние для отображения списка фильтров на мобильном
  const [showTagsModal, setShowTagsModal] = useState(false);

  const tagListRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // 600px соответствует медиа-запросу
      setIsMobile(window.innerWidth <= 600);
    };

    if (typeof window !== "undefined") {
      checkMobile();
      window.addEventListener("resize", checkMobile);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", checkMobile);
      }
    };
  }, []);

  const toLocalized = (label: string, uaVal: string) => {
    if (lang === "uk") return uaVal;
    if (label === "metro") {
      for (const line in METRO_LINES) {
        const idx = METRO_LINES[line].ua.indexOf(uaVal);
        if (idx !== -1) return METRO_LINES[line].en[idx];
      }
    }
    if (label === "districts") {
      for (const shore in SHORE_DISTRICTS) {
        const idx = SHORE_DISTRICTS[shore].ua.indexOf(uaVal);
        if (idx !== -1) return SHORE_DISTRICTS[shore].en[idx];
      }
    }
    return uaVal;
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      const rawLocation = searchParams.get("locationfilters");
      const globalQ = searchParams.get("search");
      const newTags: Tag[] = [];
      if (globalQ) {
        newTags.push({ type: "search", value: globalQ });
      }
      if (rawLocation) {
        try {
          const decoded = decodeURIComponent(decodeURIComponent(rawLocation));
          const parsed = JSON.parse(decoded);
          // --- Ваша логика парсинга тегов из searchParams ---
          if (parsed.metro?.length) {
            const stationsLeft = [...parsed.metro];
            for (const line in METRO_LINES) {
              const lineStations = METRO_LINES[line].ua;
              const selected = lineStations.filter((s) =>
                stationsLeft.includes(s)
              );
              if (selected.length === lineStations.length) {
                newTags.push({ type: "metro", value: line, fullName: line });
                selected.forEach((s) => {
                  const idx = stationsLeft.indexOf(s);
                  if (idx > -1) stationsLeft.splice(idx, 1);
                });
              }
            }
            stationsLeft.forEach((s) =>
              newTags.push({ type: "metro", value: toLocalized("metro", s) })
            );
          }
          if (parsed.districts?.length) {
            const districtsLeft = [...parsed.districts];
            for (const shore in SHORE_DISTRICTS) {
              const shoreDistricts = SHORE_DISTRICTS[shore].ua;
              const selected = shoreDistricts.filter((d) =>
                districtsLeft.includes(d)
              );
              if (selected.length === shoreDistricts.length) {
                newTags.push({
                  type: "districts",
                  value: shore,
                  fullName: shore,
                });
                selected.forEach((d) => {
                  const idx = districtsLeft.indexOf(d);
                  if (idx > -1) districtsLeft.splice(idx, 1);
                });
              }
            }
            districtsLeft.forEach((d) =>
              newTags.push({
                type: "districts",
                value: toLocalized("districts", d),
              })
            );
          }
          if (parsed.streets?.length) {
            parsed.streets.forEach((val: string) =>
              newTags.push({ type: "street", value: val })
            );
          }
          if (parsed.newbuildings?.length) {
            parsed.newbuildings.forEach((val: string) =>
              newTags.push({ type: "jk", value: val })
            );
          }
          if (parsed.directions?.length) {
            parsed.directions.forEach((dir: string) =>
              newTags.push({ type: "directions", value: dir })
            );
          }
          if (parsed.polygon != "") {
            newTags.push({
              type: "Полігон",
              value: "Пользовательський полігон",
            });
          }
          // --- Конец логики парсинга ---
        } catch (err) {
          console.error("Ошибка при разборе locationfilters:", err);
        }
      }
      setTags(newTags);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchParams]);

  const removeTag = (index: number) => {
    const newTags = [...tags];
    const removedTag = newTags.splice(index, 1)[0];
    setTags(newTags);

    const params = new URLSearchParams(window.location.search);

    if (removedTag.type === "search") {
      params.delete("search");
      router.replace(`?${params.toString()}`);
      return;
    }

    const rawLocation = searchParams.get("locationfilters");
    if (!rawLocation) return;

    try {
      const decoded = decodeURIComponent(decodeURIComponent(rawLocation));
      const parsed = JSON.parse(decoded);

      switch (removedTag.type) {
        case "metro":
          if (removedTag.fullName) {
            const lineKey = removedTag.fullName as keyof typeof METRO_LINES;
            const lineStationsUa = METRO_LINES[lineKey].ua;
            parsed.metro = parsed.metro.filter(
              (s: string) => !lineStationsUa.includes(s)
            );
          } else {
            parsed.metro = parsed.metro.filter(
              (s: string) => s !== removedTag.value
            );
          }
          break;

        case "districts":
          if (removedTag.fullName) {
            const shoreKey =
              removedTag.fullName as keyof typeof SHORE_DISTRICTS;
            const shoreDistrictsUa = SHORE_DISTRICTS[shoreKey].ua;
            parsed.districts = parsed.districts.filter(
              (d: string) => !shoreDistrictsUa.includes(d)
            );
          } else {
            parsed.districts = parsed.districts.filter(
              (d: string) => d !== removedTag.value
            );
          }
          break;

        case "street":
          parsed.streets = parsed.streets.filter(
            (d: string) => d !== removedTag.value
          );
          break;

        case "jk":
          parsed.newbuildings = parsed.newbuildings.filter(
            (d: string) => d !== removedTag.value
          );
          break;

        case "directions":
          parsed.directions = parsed.directions.filter(
            (d: string) => d !== removedTag.value
          );
          break;

        case "Полігон":
          delete parsed.polygon;
          delete parsed.userPolygon;
          break;
      }

      const encoded = encodeURIComponent(JSON.stringify(parsed));
      params.set("locationfilters", encoded);
      router.replace(`?${params.toString()}`);
    } catch (err) {
      console.error("Ошибка при обновлении locationfilters:", err);
    }
  };

  const clearAllTags = () => {
    const params = new URLSearchParams(window.location.search);
    const rawLocation = searchParams.get("locationfilters");
    if (!rawLocation) {
      return;
    }

    try {
      const decoded = decodeURIComponent(decodeURIComponent(rawLocation));
      const parsed = JSON.parse(decoded);

      delete parsed.metro;
      delete parsed.districts;
      delete parsed.streets;
      delete parsed.newbuildings;
      delete parsed.directions;
      delete parsed.polygon;
      delete parsed.userPolygon;
      params.delete("search");
      const hasAny = Object.keys(parsed).length > 0;
      if (hasAny) {
        params.set(
          "locationfilters",
          encodeURIComponent(JSON.stringify(parsed))
        );
      } else {
        params.delete("locationfilters");
      }

      router.replace(`?${params.toString()}`);
    } catch (err) {
      console.error("clearAllTags error:", err);
      params.delete("locationfilters");
      router.replace(`?${params.toString()}`);
    }
  };

  const clearInputValue = () => {
    setInputValue("");
    setShowModal(false);
  };

  const activeFilterCount = tags.filter((tag) => tag.type !== "search").length;

  return (
    <div className={styles.searchInputWrapper}>
      <div className={styles.tagsContainer}>
        {/* 1. Условный рендеринг счетчика / списка тегов */}
        {tags.length > 0 && (
          <>
            {/* Мобильный счетчик: Показывается только на мобильных при активных фильтрах */}
            {isMobile && activeFilterCount > 0 && (
              <div
                className={styles.tagCounter}
                onClick={(e) => {
                  // Изменено: теперь открывает окно фильтров, а не модалку выбора
                  e.stopPropagation();
                  setShowTagsModal(!showTagsModal);
                }}
                title={t("view_filters") ?? "Посмотреть фильтры"}
              >
                {activeFilterCount}
              </div>
            )}
            {/* Десктопный список тегов: Показывается только на десктопе */}
            {!isMobile && (
              <div ref={tagListRef} className={styles.tagList}>
                {tags.map((tag, idx) => (
                  <span key={idx} className={styles.tag}>
                    {t(tag.type)}: {t(tag.fullName ?? tag.value)}
                    <button
                      type="button"
                      className={styles.removeTagButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(idx);
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        {/* 2. Модальное окно для мобильных тегов */}
        {isMobile && showTagsModal && activeFilterCount > 0 && (
          <div className={styles.mobileTagsModal}>
            <div className={styles.mobileTagsHeader}>
              <span>{t("active_filters") ?? "Активні фільтри"}</span>
              <button
                className={styles.closeTagsModal}
                onClick={() => setShowTagsModal(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.mobileTagsList}>
              {tags.map(
                (tag, idx) =>
                  // Не показываем тег глобального поиска в фильтрах, если он считается отдельно,
                  // или уберите условие tag.type !== "search", если хотите видеть и его.
                  tag.type !== "search" && (
                    <div key={idx} className={styles.mobileTagItem}>
                      <span>
                        {t(tag.type)}: {t(tag.fullName ?? tag.value)}
                      </span>
                      <button
                        type="button"
                        className={styles.mobileRemoveTagBtn}
                        onClick={() => removeTag(idx)}
                      >
                        ×
                      </button>
                    </div>
                  )
              )}
            </div>

            <button
              className={styles.mobileClearAllBtn}
              onClick={() => {
                clearAllTags();
                setShowTagsModal(false);
              }}
            >
              {t("clear_all") ?? "Очистити все"}
            </button>
          </div>
        )}

        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              const value = e.target.value;
              setInputValue(value);
              setShowModal(value.trim().length > 0);
            }}
            onClick={openLocationModal}
            onKeyDown={(e) => handleSearchKeyDown(e, inputValue)}
            className={styles.input}
          />
        </div>

        {/* Кнопка "Очистить все теги" - только на десктопе */}
        {!isMobile && tags.some((tag) => tag.type !== "") && (
          <button
            type="button"
            className={styles.clearAllButton}
            onClick={clearAllTags}
            title={t("clear_all") ?? "Очистити фільтри"}
            style={{ right: "40px" }}
          >
            ×
          </button>
        )}

        {/* === МОБИЛЬНАЯ КНОПКА ПОИСКА: ВНУТРИ tagsContainer === */}
        {isMobile && (
          <button
            className={styles.searchButton}
            onClick={() => handleSearchSubmit(inputValue)}
          >
            {t("search_button")}
          </button>
        )}
      </div>

      {/* === ДЕСКТОПНАЯ КНОПКА ПОИСКА: ВНЕ tagsContainer === */}
      {!isMobile && (
        <button
          className={styles.searchButton}
          onClick={() => handleSearchSubmit(inputValue)}
        >
          {t("search_button")}
        </button>
      )}

      {showModal && (
        <SearchModal
          query={inputValue}
          onClose={() => setShowModal(false)}
          onSelect={(val) => {
            setInputValue(val);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
