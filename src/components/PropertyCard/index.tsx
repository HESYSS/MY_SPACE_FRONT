import { Property } from "../../types/property";
import { Link } from "react-router-dom";
import styles from "./styles.module.css"; // Corrected import to use 'styles'

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  // console.log(property);
  console.log(property);
  // Function to format price for better readability
  const formatPrice = (
    price: number | undefined,
    currency: string | undefined
  ) => {
    if (price === undefined) return "N/A";
    const formattedPrice = new Intl.NumberFormat("en-US").format(price);
    return `${formattedPrice} ${currency ?? ""}`;
  };

  // Function to format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "long",
        year: "numeric",
      };
      // Customize month names for Ukrainian
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
      return dateString; // Return original if parsing fails
    }
  };

  return (
    <div className={styles["property-card"]}>
      <div className={styles["property-image-wrapper"]}>
        <img
          src={property.firstImage}
          alt={property.title}
          className={styles["property-card-image"]}
        />
      </div>
      <div className={styles["property-content"]}>
        <h3 className={styles["property-title"]}>{property.title}</h3>
        <p className={styles["property-deal-description"]}>
          {property.discription}
        </p>
        {/* Assumes 'district' exists in the Property type */}
        <p className={styles["property-location"]}>{property.street} район</p>
        <p className={styles["property-price"]}>
          {formatPrice(property.prices[0]?.value, property.prices[0]?.currency)}
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
          <span className={styles["property-date"]}>ы</span>
        </div>
        {/* <Link to={`/property/${property.id}`} className={styles["property-card-link"]}>
          Детальніше
        </Link> */}
      </div>
    </div>
  );
}
