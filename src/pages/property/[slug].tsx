// PropertyPage.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./PropertyPage.module.css";
import PropertyImagesGallery from "./PropertyImagesGallery/PropertyImagesGallery";
import { useModal } from "../../hooks/useModal";
import { useTranslation } from "react-i18next";

import MapSinglePoint from "../map";

// Импортируем иконки
import BedIcon from "../../../public/icons/Frame153.svg"; // Укажите правильный путь
import RulerIcon from "../../../public/icons/Frame204.svg"; // Укажите правильный путь
import Head from "next/head";
import { NextSeo, ProductJsonLd } from "next-seo";

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
  prices: { value: string; currency: string };
  images: PropertyImage[];
  isNewBuilding: boolean;
  isOutOfCity: boolean;
  article: string;
  category: string;
  contacts?: PropertyContact | null;
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

interface PropertyContact {
  name: string; // ФИО
  phone: string; // Номер (может содержать несколько, разделенных запятыми)
  email?: string; // Почта
}

export default function PropertyPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { openModal } = useModal();
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language == "uk" ? "ua" : i18n.language;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const backendUrl = process.env.REACT_APP_API_URL;

        const res = await fetch(`${backendUrl}/items/${slug}?lang=${lang}`);

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
  }, [slug, lang]);

  if (loading) return <p>{t("loading")}</p>;
  if (error)
    return (
      <p>
        {t("error")}: {error}
      </p>
    );
  if (!property) return <p>{t("objectNotFound")}</p>;

  const formattedPrice = property.prices?.value
    ? `${property.prices.value.toLocaleString()} ${property.prices.currency}`
    : "N/A";

  const { street, city, lat, lng } = property.location;
  const description = property.description;

  const mapCoords = { lat: Number(lat), lng: Number(lng) };

  const initialFeatures = Object.entries(property.characteristics)
    .filter(
      ([key, value]) =>
        value !== null &&
        value !== undefined &&
        !(typeof value === "string" && value === "")
    )
    .map(([key, value]) => {
      let displayValue: string | boolean | number = value as unknown as
        | string
        | boolean
        | number;

      // Добавляем м² для всех полей, связанных с площадью
      const areaKeys = [
        "Загальна площа",
        "Площа кухні",
        "Площа житлова",
        "Площа землі",
        "Total area",
        "Kitchen area",
        "Living area",
        "Land area",
      ];

      if (areaKeys.includes(key) && typeof value !== "boolean") {
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
      value: property.article,
    });
  }
  const metaDescription =
    description?.slice(0, 160).replace(/<\/?[^>]+(>|$)/g, "") ||
    `${property.title} — ${t("realEstateOffer")}`;
  const backendUrl = process.env.DOMENIAN_URL;
  console.log(backendUrl);
  // 🔹 JSON-LD для Google (структурированные данные)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: property.title,
    description: description,
    price: property.prices?.value || "",
    priceCurrency: property.prices?.currency || "USD",
    url: `${backendUrl}/catalog/${slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: city,
      addressCountry: property.location.country,
    },
    image: property.images?.[0]?.url || "",
  };

  return (
    <>
      {/* 🔹 SEO-блок */}
      <NextSeo
        title={`${property.title} | ${property.location.city} | MySpace`}
        description={metaDescription}
        canonical={`${backendUrl}/property/${slug}`}
        openGraph={{
          url: `${backendUrl}/property/${slug}`,
          title: `${property.title} | ${property.location.city} | MySpace`,
          description: metaDescription,
          images: property.images.length
            ? property.images.map((img) => ({
                url: img.url,
                width: 1200,
                height: 800,
                alt: property.title,
              }))
            : [
                {
                  url: `${backendUrl}/default-og-image.jpg`,
                  width: 1200,
                  height: 800,
                  alt: "MySpace",
                },
              ],
          site_name: "MySpace",
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
        languageAlternates={[
          {
            hrefLang: "uk",
            href: `${backendUrl}/uk/property/${slug}`,
          },

          {
            hrefLang: "en",
            href: `${backendUrl}/en/property/${slug}`,
          },
        ]}
      />

      <ProductJsonLd
        productName={property.title}
        description={metaDescription}
        images={property.images.map((img) => img.url)}
        brand="MySpace"
        offers={[
          {
            price: property.prices?.value?.toString() || "0",
            priceCurrency: property.prices?.currency || "USD",
            availability: "https://schema.org/InStock",
            url: `https://yourdomain.com/property/${slug}`,
          },
        ]}
      />

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
                  <img
                    src={BedIcon.src}
                    alt={t("bedroomsAlt")}
                    className={styles.featureIcon}
                  />
                  <span>
                    {t("кімнат")}{" "}
                    {features.find((f) =>
                      ["Кількість кімнат", "Rooms"].includes(f.name)
                    )?.value || "N/A"}
                  </span>
                </div>
                <div className={styles.featureItem}>
                  {/* ИЗМЕНЕНИЕ: Используем изображение RulerIcon */}
                  <img
                    src={RulerIcon.src}
                    alt={t("areaAlt")}
                    className={styles.featureIcon}
                  />
                  <span>
                    {t("площа")}{" "}
                    {features.find((f) =>
                      ["Загальна площа", "Total area"].includes(f.name)
                    )?.value || "N/A"}
                  </span>
                </div>
              </div>
              <div className={styles.priceAndButton}>
                <p className={styles.price}>{formattedPrice}</p>

                {/* ✅ Блок с контактами, который перебирает все контакты */}
                {property.contacts && (
                  <div className={styles.managerInfo}>
                    <p className={styles.managerLabel}>
                      {t("objectManagerLabel") || "Менеджер об'єкту"}:
                    </p>

                    <div className={styles.singleContactBlock}>
                      {/* ФИО */}
                      <p className={styles.managerName}>
                        {property.contacts.name}
                      </p>

                      {/* Разделение телефонов на отдельные номера */}
                      {property.contacts.phone &&
                        property.contacts.phone
                          .split(",")
                          .map((phoneNum, phoneIndex) => (
                            <a
                              key={phoneIndex}
                              href={`tel:${phoneNum.trim()}`}
                              className={styles.managerPhone}
                            >
                              {phoneNum.trim()}
                            </a>
                          ))}

                      {/* Email отдельной строкой */}
                      {property.contacts.email && (
                        <a
                          href={`mailto:${property.contacts.email}`}
                          className={styles.managerEmail}
                        >
                          {property.contacts.email}
                        </a>
                      )}
                    </div>
                  </div>
                )}

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
    </>
  );
}
