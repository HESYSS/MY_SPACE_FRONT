"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SHORE_DISTRICTS,
  METRO_LINES,
} from "../LocationModal/locationFiltersConfig";

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
  const { t } = useTranslation("common");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState("");
  const tagListRef = useRef<HTMLDivElement>(null);

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
    const rawLocation = searchParams.get("locationfilters");
    if (!rawLocation) {
      setTags([]);
      return;
    }

    try {
      const decoded = decodeURIComponent(decodeURIComponent(rawLocation));
      const parsed = JSON.parse(decoded);
      const newTags: Tag[] = [];

      if (parsed.metro?.length) {
        const stationsLeft = [...parsed.metro];
        for (const line in METRO_LINES) {
          const lineStations = METRO_LINES[line].ua;
          const selected = lineStations.filter((s) => stationsLeft.includes(s));
          if (selected.length === lineStations.length) {
            newTags.push({ type: "Метро", value: line, fullName: line });
            selected.forEach((s) => {
              const idx = stationsLeft.indexOf(s);
              if (idx > -1) stationsLeft.splice(idx, 1);
            });
          }
        }
        stationsLeft.forEach((s) => newTags.push({ type: "Метро", value: s }));
      }

      if (parsed.districts?.length) {
        const districtsLeft = [...parsed.districts];
        for (const shore in SHORE_DISTRICTS) {
          const shoreDistricts = SHORE_DISTRICTS[shore].ua;
          const selected = shoreDistricts.filter((d) =>
            districtsLeft.includes(d)
          );
          if (selected.length === shoreDistricts.length) {
            newTags.push({ type: "Район", value: shore, fullName: shore });
            selected.forEach((d) => {
              const idx = districtsLeft.indexOf(d);
              if (idx > -1) districtsLeft.splice(idx, 1);
            });
          }
        }
        districtsLeft.forEach((d) => newTags.push({ type: "Район", value: d }));
      }

      if (parsed.streets?.length) {
        parsed.streets.forEach((val: string) =>
          newTags.push({ type: "Вулиця", value: val })
        );
      }

      if (parsed.newbuildings?.length) {
        parsed.newbuildings.forEach((val: string) =>
          newTags.push({ type: "Новобудова", value: val })
        );
      }

      setTags(newTags);
    } catch (err) {
      console.error("Ошибка при разборе locationfilters:", err);
      setTags([]);
    }
  }, [searchParams]);

  const removeTag = (index: number) => {
    const newTags = [...tags];
    const removedTag = newTags.splice(index, 1)[0];
    setTags(newTags);

    const rawLocation = searchParams.get("locationfilters");
    if (!rawLocation) return;

    try {
      const decoded = decodeURIComponent(decodeURIComponent(rawLocation));
      const parsed = JSON.parse(decoded);

      switch (removedTag.type) {
        case "Метро":
          if (removedTag.fullName) {
            const lineKey = removedTag.fullName as keyof typeof METRO_LINES;
            const lineStations = METRO_LINES[lineKey].ua;
            parsed.metro = parsed.metro.filter(
              (s: string) => !lineStations.includes(s)
            );
          } else {
            parsed.metro = parsed.metro.filter(
              (s: string) => s !== removedTag.value
            );
          }
          break;

        case "Район":
          if (removedTag.fullName) {
            const shoreKey = removedTag.fullName as keyof typeof SHORE_DISTRICTS;
            const shoreDistricts = SHORE_DISTRICTS[shoreKey].ua;
            parsed.districts = parsed.districts.filter(
              (d: string) => !shoreDistricts.includes(d)
            );
          } else {
            parsed.districts = parsed.districts.filter(
              (d: string) => d !== removedTag.value
            );
          }
          break;

        case "Вулиця":
          parsed.streets = parsed.streets.filter((d: string) => d !== removedTag.value);
          break;

        case "Новобудова":
          parsed.newbuildings = parsed.newbuildings.filter(
            (d: string) => d !== removedTag.value
          );
          break;
      }

      const hasActiveFilters =
        (parsed.metro?.length || 0) > 0 ||
        (parsed.districts?.length || 0) > 0 ||
        (parsed.streets?.length || 0) > 0 ||
        (parsed.newbuildings?.length || 0) > 0;

      const params = new URLSearchParams(window.location.search);

      if (hasActiveFilters) {
        const encoded = encodeURIComponent(JSON.stringify(parsed));
        params.set("locationfilters", encoded);
      } else {
        params.delete("locationfilters");
      }

      router.replace(`?${params.toString()}`);
    } catch (err) {
      console.error("Ошибка при обновлении locationfilters:", err);
    }
  };

  return (
    <div className={styles.searchInputWrapper}>
      <div className={styles.tagsContainer}>
        {tags.length > 0 && (
          <div ref={tagListRef} className={styles.tagList}>
            {tags.map((tag, idx) => (
              <span key={idx} className={styles.tag}>
                {tag.type}: {tag.fullName ?? tag.value}
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
        <input
          type="text"
          placeholder={t("search_placeholder")}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className={styles.input}
          onClick={openLocationModal}
        />
      </div>
      <button className={styles.searchButton} onClick={handleSearchSubmit}>
        {t("search_button")}
      </button>
    </div>
  );
}
