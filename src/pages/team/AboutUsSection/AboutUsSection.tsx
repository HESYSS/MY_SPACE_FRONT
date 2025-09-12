// components/AboutUsSection/AboutUsSection.jsx

import { useState, useEffect } from 'react';
import styles from './AboutUsSection.module.css';
import { useTranslation } from 'react-i18next';

// Интерфейс для данных об изображении
interface SiteImage {
  id: number;
  name: string;
  url: string;
}

export default function AboutUsSection() {
  const { t } = useTranslation('common');
  const [aboutUsImage, setAboutUsImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:3001/images");
      if (response.ok) {
        const data: SiteImage[] = await response.json();
        const foundImage = data.find(img => img.name === 'teamAbout.png');
        if (foundImage) {
          setAboutUsImage(foundImage.url);
        } else {
          console.warn("Изображение с именем 'teamAbout' не найдено.");
          // Можно установить изображение-заглушку, если основное не найдено
          setAboutUsImage('/path/to/placeholder-image.png');
        }
      } else {
        console.error("Не удалось получить изображения:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка сети при получении изображений:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles.aboutUs}>
      <div className={styles.titleSection}>
        <h2 className={styles.mainTitle}>{t('aboutUsTitle')}</h2>
        <div className={styles.line8}></div>
      </div>
      <div className={styles.contentSection}>
        <div className={styles.imageContainer}>
          {aboutUsImage && (
            <img
              src={aboutUsImage}
              alt={t('teamImageAlt')}
              className={styles.mainImage}
            />
          )}
        </div>
        <div className={styles.textContainer}>
          <div className={styles.frame272}>
            <p className={styles.textHeading}>
              {t('aboutUsMission')}
            </p>
            <p className={styles.textBody}>
              {t('aboutUsTextBody')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}