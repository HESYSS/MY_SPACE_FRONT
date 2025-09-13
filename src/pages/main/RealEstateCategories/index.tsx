// components/RealEstateCategories/RealEstateCategories.jsx

import { useState, useEffect } from 'react';
import styles from './RealEstateCategories.module.css';
import { useTranslation } from 'react-i18next';

// Интерфейс для данных об изображении
interface SiteImage {
  id: number;
  name: string;
  url: string;
}

export default function RealEstateCategories() {
  const { t } = useTranslation('common');
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Функция для получения изображений с бэкенда
  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:3001/images");
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

  // Вспомогательная функция для получения URL по имени
  const getImageUrlByName = (name: string): string | undefined => {
    const image = images.find(img => img.name === name);
    return image ? `url(${image.url})` : undefined;
  };

  // Получаем URL для каждого изображения по его имени
  const houseImageStyle = { backgroundImage: getImageUrlByName('TownHouse.png') };
  const commercialImageStyle = { backgroundImage: getImageUrlByName('Commercial.png') };
  const apartmentImageStyle = { backgroundImage: getImageUrlByName('apartment.png') };
  const landPlotsImageStyle = { backgroundImage: getImageUrlByName('LandPlots.png') };

  if (loading) {
    return <div>Загрузка категорий...</div>; // Можно добавить более сложный лоадер
  }
  
  return (
    <div className={styles.realEstateP}>
      <div className={styles.titleRealEstate}>
        <div className={styles.line8}></div>
        <h2 className={styles.mainTitle}>{t('allRealEstateTitle')}</h2>
      </div>
      <div className={styles.columnsRealEstate}>
        <div className={styles.column1}>
          <div className={styles.frame48}>
            <p className={styles.textBlock}>{t('bestOffers')}</p>
          </div>
          <a href="#" className={styles.frame49} style={houseImageStyle}>
            <p className={styles.categoryTitle}>{t('build')}</p> 
          </a>
        </div>
        <div className={styles.frame369}>
          <a href="#" className={styles.column2} style={commercialImageStyle}>
            <p className={styles.categoryTitle}>{t('Commercial')}</p>
          </a>
        </div>
        <div className={styles.column3}>
          <a href="#" className={styles.frame43} style={apartmentImageStyle}>
            <p className={styles.categoryTitle}>{t('apartment')}</p>
          </a>
          <div className={styles.frame47}>
            <p className={styles.textBlock}>{t('largeSelection')}</p>
          </div>
        </div>
        <div className={styles.column4}>
          <a href="#" className={styles.frame43} style={landPlotsImageStyle}>
            <p className={styles.categoryTitle}>{t('LandPlots')}</p>
          </a>
        </div>
      </div>
    </div>
  );
}