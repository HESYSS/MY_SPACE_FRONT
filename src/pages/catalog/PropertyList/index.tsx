import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/types/property";

interface Props {
  properties: Property[];
  loading: boolean;
}

export default function PropertyList({ properties, loading }: Props) {
  const [page, setPage] = useState(1);
  const pageSize = 9; // чтобы 3x3 в ряд
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedProperties = properties.slice(start, end);

  return (
    <div>
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <div
          className="properties"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {paginatedProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}

      {/* Пагинация */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Назад
        </button>
        <span>Сторінка {page}</span>
        <button
          onClick={() => setPage((p) => (end >= properties.length ? p : p + 1))}
          disabled={end >= properties.length}
        >
          Вперед
        </button>
      </div>
    </div>
  );
}
