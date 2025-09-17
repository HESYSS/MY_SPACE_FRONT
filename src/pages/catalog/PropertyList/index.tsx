import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/types/property";
import styles from "./PropertyList.module.css";

interface Props {
  properties: Property[];
  loading: boolean;
  page: number;
  setPage: (p: number) => void;
  totalCount: number;
  pageSize: number;
}

export default function PropertyList({
  properties,
  loading,
  page,
  setPage,
  totalCount,
  pageSize,
}: Props) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className={styles.propertyListContainer}>
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <div className={styles.propertiesGrid}>
          {(properties || []).map((p) => (
            <Link key={p.id} href={`/property/${p.id}`} passHref>
              <PropertyCard property={p} />
            </Link>
          ))}
        </div>
      )}

      {/* Пагинация */}
      <div className={styles.pagination}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Назад
        </button>
        <span>
          Сторінка {page} з {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Вперед
        </button>
      </div>
    </div>
  );
}