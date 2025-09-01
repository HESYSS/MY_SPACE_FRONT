// PropertyPage.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./PropertyPage.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyImagesGallery from "./PropertyImagesGallery/PropertyImagesGallery";

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
  };

  prices: { value: number; currency: string }[];

  images: PropertyImage[];

  isNewBuilding: boolean;

  isOutOfCity: boolean;
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
  const [mainImage, setMainImage] = useState<string | null>(null);
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
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0].url);
        }
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

  const handleImageClick = (url: string) => {
    setMainImage(url);
  };

  const formattedPrice = property.prices[0]?.value
    ? `${property.prices[0].value.toLocaleString()} ${
        property.prices[0].currency
      }`
    : "N/A";

  return (
    <div className={styles.mainDiv}>
      <div className={styles.propertyPage}>
        <main className={styles.contentWrapper}>
          <section className={styles.imageSection}>
            <PropertyImagesGallery
              images={property.images}
              onImageClick={handleImageClick}
            />
          </section>

          <section className={styles.infoSection}>
            <h1 className={styles.title}>{property.title}</h1>
            <p className={styles.subtitle}>{property.type}</p>
            <p className={styles.price}>{formattedPrice}</p>
          </section>
        </main>
      </div>
    </div>
  );
}
