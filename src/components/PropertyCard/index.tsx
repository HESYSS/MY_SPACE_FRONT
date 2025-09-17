// components/PropertyCard.tsx
import { Property } from "../../types/property";
import Image from "next/image";
import styles from "./styles.module.css";
import { useTranslation } from "react-i18next";

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language;

  // Форматування ціни
  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return t("N/A");
    const formattedPrice = new Intl.NumberFormat("uk-UA").format(price);
    return `${formattedPrice} ${currency ?? ""}`;
  };

  // Форматування дати
  const formatDate = (dateString?: string) => {
    if (!dateString) return t("N/A");
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "long",
        year: "numeric",
      };
      return new Intl.DateTimeFormat(lang, options).format(date);
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  // Видаляємо HTML-теги
  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  // Короткий опис
  const getShortDescription = (html: string, maxChars = 50) => {
    if (!html) return "";
    const text = stripHtml(html);
    return text.length > maxChars ? text.slice(0, maxChars) + "..." : text;
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
          <div className={styles["property-card-placeholder"]}>
            {t("No Image")}
          </div>
        )}
      </div>

      <div className={styles["property-content"]}>
        <h3 className={styles["property-title"]}>{property.title}</h3>
        <div
          className={styles["property-description"]}
          dangerouslySetInnerHTML={{
            __html: getShortDescription(property.description),
          }}
        />
        <p className={styles["property-location"]}>
          {t("район")} {property.district}
        </p>
        <p className={styles["property-price"]}>
          {formatPrice(
            property.prices?.[0]?.value,
            property.prices?.[0]?.currency
          )}
        </p>

        <div className={styles["property-details"]}>
          <div className={styles["detail-item"]}>
            <span className={styles.icon}>📏</span>
            <span>
              {property.area} {t("кв/м")}
            </span>
          </div>
          <div className={styles["detail-item"]}>
            <span className={styles.icon}>🛏️</span>
            <span>
              {t("кімнат")}: {property.rooms}
            </span>
          </div>
        </div>

        <div className={styles["property-footer"]}>
          <span className={styles["property-type"]}>{property.type}</span>
          <span className={styles["property-date"]}>
            {formatDate(property.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
