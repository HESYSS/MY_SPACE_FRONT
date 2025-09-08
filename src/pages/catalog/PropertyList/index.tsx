import { useState } from "react";
import Link from "next/link"; // Импортируем компонент Link
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/types/property";
import styles from "./PropertyList.module.css";

interface Props {
  properties: Property[];
  loading: boolean;
}

export default function PropertyList({ properties, loading }: Props) {
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedProperties = properties.slice(start, end);

  return (
    <div className={styles.propertyListContainer}>
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <div className={styles.propertiesGrid}>
          {paginatedProperties.map((p) => (
            // Оборачиваем PropertyCard в компонент Link
            <Link key={p.id} href={`/property/${p.id}`} passHref>
              <PropertyCard property={p} />
            </Link>
          ))}
        </div>
      )}

      {/* Пагинация */}
      <div className={styles.pagination}>
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