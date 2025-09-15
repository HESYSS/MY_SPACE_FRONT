// PropertyPage.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./PropertyPage.module.css";
import PropertyImagesGallery from "./PropertyImagesGallery/PropertyImagesGallery";
import MapWrapper from "@/components/Map/MapWrapper";
import { useModal } from "../../hooks/useModal";
import { useTranslation } from "react-i18next";

import MapSinglePoint from "../map";

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
  characteristics: any[];
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
  const { t } = useTranslation("common");

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/items/${id}`);
        if (!res.ok) throw new Error(t("objectNotFound"));
        const data: Property = await res.json();
        setProperty(data);
      } catch (err: any) {
        setError(err.message || t("errorLoading"));
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

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

  const characteristicFeatures = Object.entries(property.characteristics)
    .filter(
      ([key, value]) => value !== null && value !== undefined && value !== ""
    )
    .map(([key, value]) => ({ name: key, value }));

  const bedrooms = "2 спальні"; // временно, можно брать из характеристик
  const area = "1500 м²"; // временно, можно брать из характеристик

  // Объединяем базовые и пользовательские характеристики
  const baseFeatures = [
    { name: t("propertyType"), value: property.category },
    { name: t("objectView"), value: property.type },
    { name: t("deal"), value: property.deal },
    { name: t("street"), value: street },
    { name: t("bedroomsCount"), value: bedrooms },
    { name: t("area"), value: area },
  ];
  const features = [...baseFeatures, ...characteristicFeatures];

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
              {street}, {city}
            </p>
            <div className={styles.featuresRow}>
              <div className={styles.featureItem}>
                <span role="img" aria-label={t("bedroomsAlt")}>
                  🛏️
                </span>
                <span>{bedrooms}</span>
              </div>
              <div className={styles.featureItem}>
                <span role="img" aria-label={t("areaAlt")}>
                  📏
                </span>
                <span>{area}</span>
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
                    <strong>{feature.name}:</strong> {feature.value}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.sectionBlock}>
              <h2 className={styles.sectionTitle}>{t("descriptionTitle")}</h2>
              <p className={styles.description}>{description}</p>
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
