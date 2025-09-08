// PropertyPage.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./PropertyPage.module.css";
import PropertyImagesGallery from "./PropertyImagesGallery/PropertyImagesGallery";
import MapWrapper from "@/components/Map/MapWrapper";

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

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/items/${id}`);
        if (!res.ok) throw new Error("Обʼєкт не знайдено");
        const data: Property = await res.json();
        
        setProperty(data);
        
      } catch (err: any) {
        setError(err.message || "Помилка при завантаженні");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (!property) return <p>Обʼєкт не знайдено</p>;

  const formattedPrice = property.prices[0]?.value
    ? `${property.prices[0].value.toLocaleString()} ${
        property.prices[0].currency
      }`
    : "N/A";

  const street = property.location.street;
  const city = property.location.city;
  const propertyType = property.type;
  const description = property.description;

  const mapCoords = {
    lat: property.location.lat,
    lng: property.location.lng,
  };
  
  const bedrooms = "2 спальні";
  const area = "1500 м²";

  const features = [
    { name: "Тип нерухомості", value: property.category },
    { name: "Вид об'єкта", value: property.type },
    { name: "Операція", value: property.deal },
    { name: "Вулиця", value: property.location.street },
    { name: "Кількість спалень", value: bedrooms },
    { name: "Площа", value: area },
  ];

  return (
    <div className={styles.propertyPage}>
      <div className={styles.glowingEllipse}></div>
      <main className={styles.contentWrapper}>
        <section className={styles.mainInfoSection}>
          <div className={styles.imageGallery}>
            <PropertyImagesGallery images={property.images} onImageClick={() => {}} />
          </div>
          <div className={styles.infoSection}>
            <h1 className={styles.title}>{property.title}</h1>
            <p className={styles.location}>{street}, {city}</p>
            <p className={styles.type}>{propertyType}</p>
            <div className={styles.featuresRow}>
              <div className={styles.featureItem}>
                <Image
                  src="/icons/bed.svg"
                  alt="Спальни"
                  width={20}
                  height={20}
                />
                <span>{bedrooms}</span>
              </div>
              <div className={styles.featureItem}>
                <Image
                  src="/icons/area.svg"
                  alt="Площадь"
                  width={20}
                  height={20}
                />
                <span>{area}</span>
              </div>
            </div>
            <div className={styles.priceAndButton}>
              <p className={styles.price}>{formattedPrice}</p>
              <button className={styles.contactButton}>ОТРИМАТИ КОНСУЛЬТАЦІЮ</button>
            </div>
          </div>
        </section>

        {/* Измененная разметка для правильного порядка на планшетах */}
        <div className={styles.additionalInfo}>
          <div className={styles.detailsContainer}>
            <div className={styles.sectionBlock}>
              <h2 className={styles.sectionTitle}>Особливості</h2>
              <ul className={styles.featuresList}>
                {features.map((feature, index) => (
                  <li key={index}>
                    <strong>{feature.name}:</strong> {feature.value}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.sectionBlock}>
              <h2 className={styles.sectionTitle}>Опис</h2>
              <p className={styles.description}>{description}</p>
            </div>
          </div>
          <div className={styles.mapColumn}>
            {mapCoords.lat && mapCoords.lng && (
              <MapWrapper properties={[
                {
                  id: property.id,
                  title: property.title,
                  location: property.location,
                  coords: { lat: mapCoords.lat, lng: mapCoords.lng },
                }
              ]} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}