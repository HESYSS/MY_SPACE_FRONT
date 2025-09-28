// PropertyPage.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./PropertyPage.module.css";
import PropertyImagesGallery from "./PropertyImagesGallery/PropertyImagesGallery";
import { useModal } from "../../hooks/useModal";
import { useTranslation } from "react-i18next";

import MapSinglePoint from "../map";

// Импортируем иконки
import BedIcon from '../../../public/icons/Frame153.svg'; // Укажите правильный путь
import RulerIcon from '../../../public/icons/Frame204.svg'; // Укажите правильный путь

interface Property {
  id: number;
  crmId: string;
  status: string;
  title: string;
  description: string;
  deal: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  location: {
    country: string;
    region: string;
    city: string;
    street: string;
    lat: number;
    lng: number;
  };
  prices: { value: number; currency: string }[];
  images: PropertyImage[];
  isNewBuilding: boolean;
  isOutOfCity: boolean;
  article: string;
  category: string;
  contacts: any[];
  characteristics: PropertyCharacteristic[];
}

interface PropertyCharacteristic {
  name: string;
  value: string | boolean;
}

interface PropertyImage {
  id: number;
  url: string;
  order?: number;
  isActive?: boolean;
}

export default function PropertyPage() {
  const router = useRouter();
  const { id } = router.query;
  const { openModal } = useModal();
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const backendUrl = process.env.REACT_APP_API_URL;

        const res = await fetch(`${backendUrl}/items/${id}?lang=${lang}`);

        if (!res.ok) throw new Error(t("objectNotFound"));
        const data: Property = await res.json();
        console.log("Fetched property:", data);
        setProperty(data);
      } catch (err: any) {
        setError(err.message || t("errorLoading"));
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, lang]);

  if (loading) return <p>{t("loading")}</p>;
  if (error)
    return (
      <p>
        {t("error")}: {error}
      </p>
    );
  if (!property) return <p>{t("objectNotFound")}</p>;

  const formattedPrice = property.prices[0]?.value
    ? `${property.prices[0].value.toLocaleString()} ${
        property.prices[0].currency
      }`
    : "N/A";

  const { street, city, lat, lng } = property.location;
  const description = property.description;

  const mapCoords = { lat: Number(lat), lng: Number(lng) };

  const initialFeatures = Object.entries(property.characteristics)
    .filter(
      ([key, value]) => value !== null && value !== undefined && !(typeof value === 'string' && value === "")
    )
    .map(([key, value]) => {
      let displayValue: string | boolean | number = value as unknown as string | boolean | number;

      // Добавляем м² для всех полей, связанных с площадью
      const areaKeys = [
        "Загальна площа",
        "Площа кухні",
        "Площа житлова",
        "Площа землі",
      ];

      if (areaKeys.includes(key) && typeof value !== 'boolean') {
        // ✅ ИСПРАВЛЕНИЕ: Мы знаем, что value не boolean, поэтому можем безопасно форматировать как строку
        displayValue = `${value} ${t("squareMeters")}`; 
      }

      return {
        name: key,
        value: displayValue,
      };
    });

        const features = [...initialFeatures];

    if (property.crmId) {
        features.push({
            name: t("crmIdLabel") || "ID объекта (CRM)", 
            value: property.crmId,
        });
    }


  console.log("Property features:", features);
  return (
    <div className={styles.propertyPage}>
      <div className={styles.glowingEllipse}></div>
      <main className={styles.contentWrapper}>
        <section className={styles.mainInfoSection}>
          <div className={styles.imageGallery}>
            <PropertyImagesGallery
              images={property.images}
              onImageClick={() => {}}
            />
          </div>
          <div className={styles.infoSection}>
            <h1 className={styles.title}>{property.title}</h1>
            <p className={styles.location}>
              {street}, {t(city)}
            </p>
            <div className={styles.featuresRow}>
              <div className={styles.featureItem}>
                {/* ИЗМЕНЕНИЕ: Используем изображение BedIcon */}
                <img src={BedIcon.src} alt={t("bedroomsAlt")} className={styles.featureIcon} />
                <span>
                  {t("кімнат")}{" "}
                  {features.find((f) => f.name === "Кількість кімнат")?.value ||
                    "N/A"}
                </span>
              </div>
              <div className={styles.featureItem}>
                {/* ИЗМЕНЕНИЕ: Используем изображение RulerIcon */}
                <img src={RulerIcon.src} alt={t("areaAlt")} className={styles.featureIcon} />
                <span>
                  {t("площа")}{" "}
                  {features.find((f) => f.name === "Загальна площа")?.value ||
                    "N/A"}
                </span>
              </div>
            </div>
            <div className={styles.priceAndButton}>
              <p className={styles.price}>{formattedPrice}</p>
              <button
                className={styles.contactButton}
                onClick={() => openModal("forBuyers")}
              >
                {t("getPropertyConsultation")}
              </button>
            </div>
          </div>
        </section>

        <div className={styles.additionalInfo}>
          <div className={styles.detailsContainer}>
            <div className={styles.sectionBlock}>
              <h2 className={styles.sectionTitle}>{t("featuresTitle")}</h2>
              <ul className={styles.featuresList}>
                {features.map((feature, index) => (
                  <li key={index}>
                    <strong>{t(feature.name)}:</strong> {feature.value}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.sectionBlock}>
              <h2 className={styles.sectionTitle}>{t("descriptionTitle")}</h2>
              <p
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: description }}
              ></p>
            </div>
          </div>
          <div className={styles.mapColumn}>
            {mapCoords.lat && mapCoords.lng && (
              <MapSinglePoint
                location={{
                  lat: mapCoords.lat,
                  lng: mapCoords.lng,
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}