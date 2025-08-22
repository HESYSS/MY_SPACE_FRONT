import React, { useRef } from "react";
import styles from "./style.module.css";
import { useTranslation } from "react-i18next";

const VideoSearchOverlay = () => {
  const { t } = useTranslation("common"); // Используем файл common.json
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <>
      <div className={styles.hero}>
        {/* Видео слой */}
        <video ref={videoRef} className={styles.video} autoPlay loop muted>
          <source
            src="https://www.myspace.in.ua/wp-content/uploads/2025/05/kyivGIFFlagAtStart.mp4"
            type="video/mp4"
          />
          {t('videoNotSupported')}
        </video>

        {/* Заголовок */}
        <div className={styles.heroTitleContainer}>
          <h1 className={styles.heroTitle}>{t('heroTitle')}</h1>
        </div>
      </div>

      {/* Форма поиска теперь находится вне .hero */}
      <div className={styles.searchFormContainer}>
        <div className={styles.searchForm}>
          {/* Тип послуги */}
          <div className={styles.dropdown}>
            <label htmlFor="serviceType">{t('serviceTypeLabel')}</label>
            <select id="serviceType">
              <option>{t('serviceRent')}</option>
              <option>{t('serviceSale')}</option>
              <option>{t('serviceDaily')}</option>
            </select>
          </div>

          {/* Категорія */}
          <div className={styles.dropdown}>
            <label htmlFor="category">{t('categoryLabel')}</label>
            <select id="category">
              <option>{t('categoryResidential')}</option>
              <option>{t('categoryCommercial')}</option>
            </select>
          </div>

          {/* Область */}
          <div className={styles.dropdown}>
            <label htmlFor="region">{t('regionLabel')}</label>
            <select id="region">
              <option>{t('regionKyiv')}</option>
              <option>{t('regionOdesa')}</option>
              <option>{t('regionLviv')}</option>
            </select>
          </div>

          {/* Кнопка поиска */}
          <div className={styles.searchBtnWrapper}>
            <button className={styles.searchButton}>{t('searchButton')}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoSearchOverlay;