import { Property } from "../../types/property";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  // Форматирование цены
  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return "N/A";
    const formattedPrice = new Intl.NumberFormat("en-US").format(price);
    return `${formattedPrice} ${currency ?? ""}`;
  };

  // Форматирование даты
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "long",
        year: "numeric",
      };
      const monthNames: Record<string, string> = {
        January: "Січня",
        February: "Лютого",
        March: "Березня",
        April: "Квітня",
        May: "Травня",
        June: "Червня",
        July: "Липня",
        August: "Серпня",
        September: "Вересня",
        October: "Жовтня",
        November: "Листопада",
        December: "Грудня",
      };
      const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(
        date
      );
      const day = parts.find((p) => p.type === "day")?.value;
      const monthEn = parts.find((p) => p.type === "month")?.value;
      const year = parts.find((p) => p.type === "year")?.value;

      const monthUa = monthEn ? monthNames[monthEn] : "";
      return `${day} ${monthUa}, ${year}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  return (
    <div className={styles["property-card"]}>
      <div className={styles["property-image-wrapper"]}>
        {property.firstImage ? (
          <Image
            src={property.firstImage}
            alt={property.title}
            width={400}
            height={300}
            className={styles["property-card-image"]}
          />
        ) : (
          <div className={styles["property-card-placeholder"]}>No Image</div>
        )}
      </div>

      <div className={styles["property-content"]}>
        <h3 className={styles["property-title"]}>{property.title}</h3>
        <p className={styles["property-deal-description"]}>
          {property.discription}
        </p>
        <p className={styles["property-location"]}>{property.street} район</p>
        <p className={styles["property-price"]}>
          {formatPrice(
            property.prices?.[0]?.value,
            property.prices?.[0]?.currency
          )}
        </p>

        <div className={styles["property-details"]}>
          <div className={styles["detail-item"]}>
            <span className={styles.icon}>📏</span>
            <span>{property.area} кв/м</span>
          </div>
          <div className={styles["detail-item"]}>
            <span className={styles.icon}>🛏️</span>
            <span>кімнат: {property.rooms}</span>
          </div>
        </div>

        <div className={styles["property-footer"]}>
          <span className={styles["property-type"]}>Квартира</span>
          <span className={styles["property-date"]}>
            {formatDate(property.сreatedAt)}
          </span>
        </div>

        <Link
          href={`/property/${property.id}`}
          className={styles["property-card-link"]}
        >
          Детальніше
        </Link>
      </div>
    </div>
  );
}
