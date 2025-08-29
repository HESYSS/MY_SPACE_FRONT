// pages/catalog/[type].tsx
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Filter from "@/components/Filter";
import MapWrapper from "@/components/Map/MapWrapper";
import PropertyList from "./PropertyList";

const typeMap: Record<string, string> = {
  rent: "Оренда",
  sale: "Продаж",
};

export default function CatalogPage() {
  const router = useRouter();
  const { type } = router.query; // type из URL
  const currentType = typeof type === "string" ? type : "rent";

  const [filterType, setFilterType] = useState(typeMap[currentType]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 6;

  // Данные для PropertyList
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3001/items?deal=${filterType}&page=${page}&limit=${limit}`
        );
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [filterType, page]);

  // Данные для карты
  const [allProperties, setAllProperties] = useState<any[]>([]);
  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await fetch(
          `http://localhost:3001/items/coords?deal=${filterType}`
        );
        const data = await res.json();
        setAllProperties(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchAll();
  }, [filterType]);

  return (
    <div>
      <h1>Каталог: {filterType}</h1>

      <Filter
        type={filterType}
        onTypeChange={(t) => {
          setFilterType(t);
          setPage(1);
        }}
      />

      <PropertyList properties={properties} loading={loading} />

      <h2>Мапа об’єктів</h2>
      <MapWrapper properties={allProperties} />
    </div>
  );
}
