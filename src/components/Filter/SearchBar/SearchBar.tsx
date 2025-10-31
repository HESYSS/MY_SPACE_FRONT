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
  handleSearchSubmit: () => void;
  handleSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  openLocationModal: () => void;
}

export default function SearchBar({
  handleSearchSubmit,
  handleSearchKeyDown,
  openLocationModal,
}: SearchBarProps) {
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language;
  const langKey = lang === "en" ? "en" : "ua";
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const tagListRef = useRef<HTMLDivElement>(null);

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
    const tagList = tagListRef.current;
    if (!tagList) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      tagList.classList.add(styles.dragging);
      startX = e.pageX - tagList.offsetLeft;
      scrollLeft = tagList.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      tagList.classList.remove(styles.dragging);
    };

    const onMouseUp = () => {
      isDown = false;
      tagList.classList.remove(styles.dragging);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - tagList.offsetLeft;
      const walk = (x - startX) * 1.5;
      tagList.scrollLeft = scrollLeft - walk;
    };

    tagList.addEventListener("mousedown", onMouseDown);
    tagList.addEventListener("mouseleave", onMouseLeave);
    tagList.addEventListener("mouseup", onMouseUp);
    tagList.addEventListener("mousemove", onMouseMove);

    return () => {
      tagList.removeEventListener("mousedown", onMouseDown);
      tagList.removeEventListener("mouseleave", onMouseLeave);
      tagList.removeEventListener("mouseup", onMouseUp);
      tagList.removeEventListener("mousemove", onMouseMove);
    };
  }, [tags]);

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
          console.log("Parsed locationfilters:", parsed);

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
        } catch (err) {
          console.error("Ошибка при разборе locationfilters:", err);
        }
      }

      setTags(newTags);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchParams]);

  const removeTag = (index: number) => {
    console.log("Removing tag at index:", index);
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

  return (
    <>
      <div className={styles.searchInputWrapper}>
        <div className={styles.tagsContainer}>
          {tags.length > 0 && (
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

          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value;
                setInputValue(value);
                setShowModal(value.trim().length > 0);
              }}
              onClick={openLocationModal}
              onKeyDown={handleSearchKeyDown}
              className={styles.input}
            />
            {inputValue.length > 0 && (
              <button
                type="button"
                className={styles.clearAllButton}
                onClick={clearInputValue}
                title={t("clear_input") ?? "Очистити поле"}
              >
                ×
              </button>
            )}
          </div>

          {tags.some((tag) => tag.type !== "") && (
            <button
              type="button"
              className={styles.clearAllButton}
              onClick={clearAllTags}
              title={t("clear_all") ?? "Очистити фільтри"}
            >
              ×
            </button>
          )}
        </div>

        <button className={styles.searchButton} onClick={handleSearchSubmit}>
          {t("search_button")}
        </button>
      </div>

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
    </>
  );
}
