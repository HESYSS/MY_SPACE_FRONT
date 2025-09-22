// components/RealEstateCategories/RealEstateCategories.tsx
import { useState, useEffect } from "react";
import styles from "./RealEstateCategories.module.css";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface SiteImage {
  id: number;
  name: string;
  url: string;
}

const arrowPath = "/icons/Vector4.svg";

export default function RealEstateCategories() {
  const { t } = useTranslation("common");
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const backendUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${backendUrl}/images`);
      if (response.ok) {
        const data: SiteImage[] = await response.json();
        setImages(data);
      } else {
        console.error("Failed to fetch images:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const getImageUrlByName = (name: string): string | undefined => {
    const image = images.find((img) => img.name === name);
    return image ? `url(${image.url})` : undefined;
  };

  const houseImageStyle = {
    backgroundImage: getImageUrlByName("TownHouse.png"),
  };
  const commercialImageStyle = {
    backgroundImage: getImageUrlByName("Commercial.png"),
  };
  const apartmentImageStyle = {
    backgroundImage: getImageUrlByName("apartment.png"),
  };
  const landPlotsImageStyle = {
    backgroundImage: getImageUrlByName("LandPlots.png"),
  };

  if (loading) {
    return <div>Загрузка категорий...</div>;
  }

  return (
    <div className={styles.realEstateP}>
      <div className={styles.titleRealEstate}>
        <div className={styles.line8}></div>
        <h2 className={styles.mainTitle}>{t("allRealEstateTitle")}</h2>
      </div>
      <div className={styles.columnsRealEstate}>
        <div className={styles.column1}>
          <div className={styles.frame48wrapper}>
            <div className={styles.frame48}>
              <p className={styles.textBlock}>{t("bestOffers")}</p>
            </div>
          </div>
          <Link
            href={{
              pathname: "/catalog",
              query: {
                otherfilters: encodeURIComponent(
                  JSON.stringify({
                    category: "Житлова",
                    type: "Будинок",
                  })
                ),
              },
            }}
            className={styles.frame49}
            style={houseImageStyle}
          >
            <p className={styles.categoryTitle}>{t("build")}</p>
            <div className={styles.arrowCircle}>
              <img src={arrowPath} alt="Arrow" className={styles.arrowImage} />
            </div>
          </Link>
        </div>

        <div className={styles.frame369}>
          <Link
            href={{
              pathname: "/catalog",
              query: {
                otherfilters: encodeURIComponent(
                  JSON.stringify({
                    category: "Комерційна",
                  })
                ),
              },
            }}
            className={styles.column2}
            style={commercialImageStyle}
          >
            <p className={styles.categoryTitle}>{t("Commercial")}</p>
            <div className={styles.arrowCircle}>
              <img src={arrowPath} alt="Arrow" className={styles.arrowImage} />
            </div>
          </Link>
        </div>

        <div className={styles.column3}>
          <Link
            href={{
              pathname: "/catalog",
              query: {
                otherfilters: encodeURIComponent(
                  JSON.stringify({
                    category: "Житлова",
                    type: "Квартира",
                  })
                ),
              },
            }}
            className={styles.frame43}
            style={apartmentImageStyle}
          >
            <p className={styles.categoryTitle}>{t("apartment")}</p>
            <div className={styles.arrowCircle}>
              <img src={arrowPath} alt="Arrow" className={styles.arrowImage} />
            </div>
          </Link>
          <div className={styles.frame47wrapper}>
            <div className={styles.frame47}>
              <p className={styles.textBlock}>{t("largeSelection")}</p>
            </div>
          </div>
        </div>
        <div className={styles.column4}>
          <a href="#" className={styles.frame43} style={landPlotsImageStyle}>
            <p className={styles.categoryTitle}>{t("LandPlots")}</p>
            <div className={styles.arrowCircle}>
              <img src={arrowPath} alt="Arrow" className={styles.arrowImage} />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
