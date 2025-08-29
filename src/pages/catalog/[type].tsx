import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Filter from "@/components/Filter";
import MapWrapper from "@/components/Map/MapWrapper";
import PropertyList from "./PropertyList";

const typeMap: Record<string, string> = {
  rent: "Оренда",
  sale: "Продаж",
};

export default function CatalogPage() {
  const { type } = useParams<{ type: string }>();
  const [filterType, setFilterType] = useState(typeMap[type || "rent"]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 6;

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

      {/* Список с PropertyList */}
      <PropertyList properties={properties} loading={loading} />

      {/* Карта со всеми объектами */}
      <h2>Мапа об’єктів</h2>
      <MapWrapper properties={allProperties} />
    </div>
  );
}
