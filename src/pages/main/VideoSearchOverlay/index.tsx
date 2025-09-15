import React, { useRef, useState, useEffect } from "react";
import styles from "./style.module.css";
import { useTranslation } from "react-i18next";
import axios from "axios"; // Предполагаем, что вы используете axios для запросов

const VideoSearchOverlay = () => {
  const { t } = useTranslation("common");
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null); // Состояние для хранения URL видео

  // URL вашего API-маршрута для получения данных о видео
  const backendUrl = process.env.REACT_APP_API_URL;

  const apiUrl = `${backendUrl}/images/videoMain.mp4`;

  useEffect(() => {
    // Асинхронная функция для выполнения запроса
    const fetchVideo = async () => {
      try {
        const response = await axios.get(apiUrl);
        // Предположим, что ответ содержит объект с полем `videoLink`
        setVideoUrl(response.data.url);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };
    fetchVideo();
  }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз при монтировании

  return (
    <>
      <div className={styles.hero}>
        {/* Видео слой */}
        {videoUrl ? (
          <video ref={videoRef} className={styles.video} autoPlay loop muted>
            <source src={videoUrl} type="video/mp4" />
            {t("videoNotSupported")}
          </video>
        ) : (
          // Можно показать загрузчик или заглушку, пока видео загружается
          <div className={styles.videoPlaceholder}>Loading video...</div>
        )}

        {/* Заголовок */}
        <div className={styles.heroTitleContainer}>
          <h1 className={styles.heroTitle}>{t("heroTitle")}</h1>
        </div>
      </div>

      {/* Форма поиска теперь находится вне .hero */}
      <div className={styles.searchFormContainer}>
        <div className={styles.searchForm}>
          {/* Тип послуги */}
          <div className={styles.dropdown}>
            <label htmlFor="serviceType">{t("serviceTypeLabel")}</label>
            <select id="serviceType">
              <option>{t("serviceRent")}</option>
              <option>{t("serviceSale")}</option>
              <option>{t("serviceDaily")}</option>
            </select>
          </div>

          {/* Категорія */}
          <div className={styles.dropdown}>
            <label htmlFor="category">{t("categoryLabel")}</label>
            <select id="category">
              <option>{t("categoryResidential")}</option>
              <option>{t("categoryCommercial")}</option>
            </select>
          </div>

          {/* Область */}
          <div className={styles.dropdown}>
            <label htmlFor="region">{t("regionLabel")}</label>
            <select id="region">
              <option>{t("regionKyiv")}</option>
              <option>{t("regionOdesa")}</option>
              <option>{t("regionLviv")}</option>
            </select>
          </div>

          {/* Кнопка поиска */}
          <div className={styles.searchBtnWrapper}>
            <button className={styles.searchButton}>{t("searchButton")}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoSearchOverlay;
