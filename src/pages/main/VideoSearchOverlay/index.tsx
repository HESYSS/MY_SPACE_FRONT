import React, { useRef } from "react";
import styles from "./style.module.css";

const VideoSearchOverlay = () => {
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
          Ваш браузер не поддерживает видео тег.
        </video>

        {/* Заголовок */}
        <div className={styles.heroTitleContainer}>
          <h1 className={styles.heroTitle}>Мрії мають свою адресу</h1>
        </div>
      </div>

      {/* Форма поиска теперь находится вне .hero */}
      <div className={styles.searchFormContainer}>
        <div className={styles.searchForm}>
          {/* Тип послуги */}
          <div className={styles.dropdown}>
            <label htmlFor="serviceType">ТИП ПОСЛУГИ</label>
            <select id="serviceType">
              <option>Оренда</option>
              <option>Продаж</option>
              <option>Подобово</option>
            </select>
          </div>

          {/* Категорія */}
          <div className={styles.dropdown}>
            <label htmlFor="category">КАТЕГОРІЯ</label>
            <select id="category">
              <option>Житлова нерухомість</option>
              <option>Комерційна нерухомість</option>
            </select>
          </div>

          {/* Область */}
          <div className={styles.dropdown}>
            <label htmlFor="region">ОБЛАСТЬ</label>
            <select id="region">
              <option>Київська</option>
              <option>Одеська</option>
              <option>Львівська</option>
            </select>
          </div>

          {/* Кнопка поиска */}
          <div className={styles.searchBtnWrapper}>
            <button className={styles.searchButton}>ПОШУК</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoSearchOverlay;
