import { useParams } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import Filter from "@/components/Filter";
import { properties } from "@/services/mockData";

export default function CatalogPage() {
  const { type } = useParams<{ type: string }>();
  const [filterType, setFilterType] = useState(type || "rent");

  const filtered = properties.filter((p) => p.type === filterType);

  return (
    <div>
      <main>
        <h1>Каталог: {filterType === "rent" ? "Оренда" : "Продаж"}</h1>
        <Filter type={filterType} onTypeChange={setFilterType} />
        <div className="properties">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </main>
    </div>
  );
}
