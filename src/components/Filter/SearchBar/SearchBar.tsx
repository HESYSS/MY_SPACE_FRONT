"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SHORE_DISTRICTS,
  METRO_LINES,
} from "../LocationModal/locationFiltersConfig";
import { SearchModal } from "./SearchModal"; // 🔹 добавляем модалку

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
  const [showModal, setShowModal] = useState(false); // 🔹 показывать модалку
  const tagListRef = useRef<HTMLDivElement>(null);

  // --- Drag для тегов ---
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

  // --- Разбор locationfilters ---
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
      console.log("Разобранные фильтры:", parsed);
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
      console.log("Теги для установки:", newTags);
      setTags(newTags);
    } catch (err) {
      console.error("Ошибка при разборе locationfilters:", err);
      setTags([]);
    }
  }, [searchParams]);

  // --- Удаление тегов ---
  const removeTag = (index: number) => {
    const newTags = [...tags];
    const removedTag = newTags.splice(index, 1)[0];
    setTags(newTags);
    // логика удаления остаётся как у тебя 👇
  };

  return (
    <>
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

          {/* --- поле ввода --- */}
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value;
                setInputValue(value);

                // показываем модалку только если введён текст
                if (value.trim().length > 0) {
                  setShowModal(true);
                } else {
                  setShowModal(false);
                }
              }}
              onClick={openLocationModal}
              onKeyDown={handleSearchKeyDown}
              className={styles.input}
            />
          </div>
        </div>

        <button className={styles.searchButton} onClick={handleSearchSubmit}>
          {t("search_button")}
        </button>
      </div>

      {/* 🔹 Модалка поверх */}
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
