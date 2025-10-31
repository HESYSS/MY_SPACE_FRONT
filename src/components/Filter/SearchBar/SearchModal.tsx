"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./SearchModal.module.css";
import {
  METRO_LINES,
  SHORE_DISTRICTS,
} from "../LocationModal/locationFiltersConfig";
import { useSearchParams } from "next/navigation";
import { t } from "i18next";

interface SearchModalProps {
  query: string;
  onClose: () => void;
  onSelect: (value: string) => void;
}

interface ResultItem {
  label: string;
  value: string;
}

const DATA_STORAGE_KEY = "locationData";

export const SearchModal: React.FC<SearchModalProps> = ({
  query,
  onClose,
  onSelect,
}) => {
  const [filtered, setFiltered] = useState<ResultItem[]>([]);
  const [streets, setStreets] = useState<string[]>([]);
  const [newbuildings, setNewbuildings] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Загружаем данные из localStorage ---
  useEffect(() => {
    const rawData = localStorage.getItem(DATA_STORAGE_KEY);
    if (!rawData) return;
    try {
      const parsed = JSON.parse(rawData);
      const kyivData = parsed.kyiv || {};
      setStreets(kyivData.streets || []);
      setNewbuildings(kyivData.newbuildings || []);
    } catch (err) {
      console.error("Ошибка при загрузке данных из localStorage:", err);
    }
  }, []);

  // --- Фильтруем результаты ---
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFiltered([]);
      return;
    }

    const results: ResultItem[] = [];

    // metro
    Object.entries(METRO_LINES).forEach(([line, stations]) => {
      stations.ua.forEach((station) => {
        if (station.toLowerCase().includes(q)) {
          results.push({ label: "metro", value: station });
        }
      });
    });

    Object.entries(METRO_LINES).forEach(([line, stations]) => {
      stations.en.forEach((station) => {
        if (station.toLowerCase().includes(q)) {
          results.push({ label: "metro", value: station });
        }
      });
    });

    // Районы
    Object.values(SHORE_DISTRICTS).forEach((shore) => {
      shore.ua.forEach((district) => {
        if (district.toLowerCase().includes(q)) {
          results.push({ label: "districts", value: district });
        }
      });
    });

    Object.values(SHORE_DISTRICTS).forEach((shore) => {
      shore.en.forEach((district) => {
        if (district.toLowerCase().includes(q)) {
          results.push({ label: "districts", value: district });
        }
      });
    });

    // Улицы
    streets.forEach((street) => {
      if (street.toLowerCase().includes(q)) {
        results.push({ label: "street", value: street });
      }
    });

    // Новостройки
    newbuildings.forEach((nb) => {
      if (nb.toLowerCase().includes(q)) {
        results.push({ label: "jk", value: nb });
      }
    });

    // убираем дубликаты
    const uniqueResults = Array.from(
      new Map(results.map((r) => [r.value.toLowerCase(), r])).values()
    );

    // Берем максимум 11 элементов и добавляем свой вариант последним
    const limitedResults = uniqueResults.slice(0, 11);
    limitedResults.push({ label: "search", value: q });

    setFiltered(limitedResults);
  }, [query, streets, newbuildings]);

  // --- Обработчик выбора ---
  const handleSelect = (value: string) => {
    const item = filtered.find((f) => f.value === value);
    if (!item) return;

    const params = new URLSearchParams(searchParams.toString());
    const existingFiltersParam = params.get("locationfilters");

    // --- Парсим уже существующие фильтры из URL ---
    let existingFilters: any = {};
    if (existingFiltersParam) {
      try {
        existingFilters = JSON.parse(decodeURIComponent(existingFiltersParam));
        console.log("Существующие фильтры:", existingFilters);
      } catch (e) {
        console.error("Ошибка при парсинге существующих фильтров:", e);
      }
    }

    // --- Убеждаемся, что есть массивы ---
    const filters = {
      streets: existingFilters.streets || [],
      newbuildings: existingFilters.newbuildings || [],
      metro: existingFilters.metro || [],
      districts: existingFilters.districts || [],
      isOutOfCity: existingFilters.isOutOfCity || false,
      q: "",
    };

    const toUaValue = (label: string, val: string): string => {
      switch (label) {
        case "metro":
          for (const [line, stations] of Object.entries(METRO_LINES)) {
            const idx = (stations as any).en.indexOf(val);
            if (idx !== -1) return (stations as any).ua[idx];
          }
          return val;
        case "districts":
          for (const shore of Object.values(SHORE_DISTRICTS)) {
            const idx = (shore as any).en.indexOf(val);
            if (idx !== -1) return (shore as any).ua[idx];
          }
          return val;
        default:
          return val;
      }
    };
    const uaValue = toUaValue(item.label, value);

    // --- Добавляем новое значение в нужный фильтр ---
    switch (item.label) {
      case "metro":
        if (!filters.metro.includes(value)) filters.metro.push(uaValue);
        break;
      case "districts":
        if (!filters.districts.includes(value)) filters.districts.push(uaValue);
        break;
      case "street":
        if (!filters.streets.includes(value)) filters.streets.push(value);
        break;
      case "jk":
        if (!filters.newbuildings.includes(value))
          filters.newbuildings.push(value);
        break;
      case "search":
        params.set("search", value); // 🔹 сохраняем как поиск, а не как улицу
        break;
    }
    console.log("Обновленные фильтры:", filters);
    // --- Обновляем параметр locationfilters ---
    params.set("locationfilters", encodeURIComponent(JSON.stringify(filters)));

    // --- Обновляем URL без перезагрузки страницы ---
    router.replace(`?${params.toString()}`);

    // --- Закрываем модалку ---
    onSelect("");
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <ul className={styles.results}>
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <li
                key={idx}
                className={styles.item}
                onClick={() => handleSelect(item.value)}
              >
                <strong>{t(item.label)}:</strong> {item.value}
              </li>
            ))
          ) : (
            <li className={styles.noResults}>Нічого не знайдено</li>
          )}
        </ul>
      </div>
    </div>
  );
};
