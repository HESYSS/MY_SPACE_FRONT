import { FC, useState, useRef, useEffect } from "react";
import styles from "./style.module.css";
import { useTranslation } from "react-i18next";
import Link from "next/link";

// Кастомный хук для определения ширины экрана
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  return matches;
};

// Интерфейс для данных об изображении с бэкенда
interface SiteImage {
  id: number;
  name: string;
  url: string;
}

// Интерфейс для данных слайдов карусели
interface CarouselSlide {
  src: string;
  name: string;
  text: string;
  text_en: string;
}

const Carousel: FC = () => {
  const { t, i18n } = useTranslation("common");
  const currentLanguage = i18n.language;

  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);

  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1300px)");
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Логика карусели
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ИЗМЕНЕНИЕ: Рефы для отслеживания свайпов
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);
  const swipeThreshold = 50; // Минимальная дистанция свайпа в пикселях

  // Вспомогательная функция для получения URL по имени
  const getImageUrlByName = (name: string): string => {
    const image = images.find((img) => img.name === name);
    return image ? image.url : "";
  };

  // Статический массив данных для слайдов. URL будут заполнены после загрузки.
  const baseSlidesData = [
    {
      name: "Solomianskyi.png",
      text: "Солом'янський",
      text_en: "Solomianskyi",
    },
    { name: "Podilskyi.png", text: "Подільський", text_en: "Podilskyi" },
    { name: "Pecherskyi.png", text: "Печерський", text_en: "Pecherskyi" },
    { name: "Dniprovskyi.png", text: "Дніпровський", text_en: "Dniprovskyi" },
    {
      name: "Shevchenkivskyi.png",
      text: "Шевченківський",
      text_en: "Shevchenkivskyi",
    },
    {
      name: "Holosiivskyi.png",
      text: "Голосіївський",
      text_en: "Holosiivskyi",
    },
    { name: "Obolonskyi.png", text: "Оболонський", text_en: "Obolonskyi" },
    { name: "Darnytskyi.png", text: "Дарницький", text_en: "Darnytskyi" },
    { name: "Desnianskyi.png", text: "Деснянський", text_en: "Desnianskyi" },
    {
      name: "Sviatoshynskyi.png",
      text: "Святошинський",
      text_en: "Sviatoshynskyi",
    },
  ];

  // Динамическое создание массива слайдов с загруженными URL-адресами
  const slidesData: CarouselSlide[] = baseSlidesData.map((slide) => ({
    ...slide,
    src: getImageUrlByName(slide.name),
  }));

  const loopSlides =
    slidesData.length > 0 ? [...slidesData, ...slidesData, ...slidesData] : [];
  const layerGap = -40;
  const mobileLayerGap = -15;

  const startTimer = () => {
    if (slidesData.length === 0) return;
    intervalRef.current = setInterval(() => nextSlide(), 10000);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startTimer();
  };

  const prevSlide = () => {
    if (slidesData.length === 0) return;
    setActiveIndex((prev) => prev - 1);
    resetTimer();
  };

  const nextSlide = () => {
    if (slidesData.length === 0) return;
    setActiveIndex((prev) => prev + 1);
    resetTimer();
  };

  // ИЗМЕНЕНИЕ: Обработчики для свайпов
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndRef.current = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEndRef.current;
    if (diff > swipeThreshold) {
      nextSlide();
    } else if (diff < -swipeThreshold) {
      prevSlide();
    }
  };

  // Загружаем данные с бэкенда при монтировании компонента
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const backendUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${backendUrl}/images`);
        if (response.ok) {
          const data: SiteImage[] = await response.json();
          setImages(data);
          if (data.length > 0) {
            setActiveIndex(baseSlidesData.length);
          }
        } else {
          console.error("Failed to fetch images:", response.statusText);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (slidesData.length === 0) return;

    if (!containerRef.current) return;

    if (activeIndex <= slidesData.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(activeIndex + slidesData.length);
      }, 500);
    } else if (activeIndex >= slidesData.length * 2) {
      setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(activeIndex - slidesData.length);
      }, 500);
    } else {
      setIsTransitioning(true);
    }
  }, [activeIndex, slidesData]);

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slidesData]);

  const getPositionStyle = (index: number) => {
    const offset = index - activeIndex;
    const absOffset = Math.abs(offset);
    const currentLayerGap = isMobile ? mobileLayerGap : layerGap;

    let width = 0,
      height = 0,
      opacity = 0,
      zIndex = 0,
      rotateY = 0;

    if (isMobile) {
      switch (absOffset) {
        case 0:
          width = 180;
          height = 247.5;
          opacity = 1;
          zIndex = 10;
          break;
        case 1:
          width = 140;
          height = 192.5;
          opacity = 1;
          zIndex = 7;
          rotateY = offset > 0 ? -15 : 15;
          break;
        default:
          width = 0;
          height = 0;
          opacity = 0;
          zIndex = 0;
      }
    } else if (isTablet) {
      switch (absOffset) {
        case 0:
          width = 300;
          height = 412.5;
          opacity = 1;
          zIndex = 10;
          break;
        case 1:
          width = 240;
          height = 330;
          opacity = 1;
          zIndex = 7;
          rotateY = offset > 0 ? -15 : 15;
          break;
        default:
          width = 0;
          height = 0;
          opacity = 0;
          zIndex = 0;
      }
    } else {
      switch (absOffset) {
        case 0:
          width = 400;
          height = 550;
          opacity = 1;
          zIndex = 10;
          break;
        case 1:
          width = 320;
          height = 460;
          opacity = 1;
          zIndex = 7;
          rotateY = offset > 0 ? -15 : 15;
          break;
        case 2:
          width = 240;
          height = 345;
          opacity = 0.5;
          zIndex = 5;
          rotateY = offset > 0 ? -25 : 25;
          break;
        default:
          width = 0;
          height = 0;
          opacity = 0;
          zIndex = 0;
      }
    }

    let translateX = 0;
    for (let i = 1; i <= absOffset; i++) {
      let prevW = 0,
        currW = 0;
      if (isMobile) {
        prevW = i === 1 ? 180 : 140;
        currW = i === 1 ? 140 : 0;
      } else if (isTablet) {
        prevW = i === 1 ? 300 : 240;
        currW = i === 1 ? 240 : 0;
      } else {
        prevW = i === 1 ? 400 : i === 2 ? 320 : 240;
        currW = i === 1 ? 320 : i === 2 ? 240 : 240;
      }
      translateX += (prevW + currW) / 2 + currentLayerGap;
    }

    if (offset < 0) translateX = -translateX;
    translateX -= width / 2;

    return { width, height, opacity, zIndex, translateX, rotateY };
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  // Если данных нет, ничего не показываем
  if (slidesData.length === 0) {
    return null;
  }

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselWrapper}>
        <div
          ref={containerRef}
          className={styles.slidesContainer}
          // ИЗМЕНЕНИЕ: Добавление обработчиков событий касания
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {loopSlides.map((slide, idx) => {
            const { width, height, opacity, zIndex, translateX, rotateY } =
              getPositionStyle(idx);

            if ((isTablet || isMobile) && Math.abs(idx - activeIndex) > 1) {
              return null;
            }

            if (opacity === 0) return null;

            const isCenter = zIndex === 10;
            const slideText =
              currentLanguage === "en" ? slide.text_en : slide.text;

            return (
              <div
                key={idx}
                className={`${styles.slide} ${
                  isCenter ? styles.centerSlide : ""
                }`}
                style={{
                  width,
                  height,
                  transform: `translateX(${translateX}px) translateY(-50%) rotateY(${rotateY}deg)`,
                  zIndex,
                  opacity,
                  transition: isTransitioning ? "all 0.7s ease" : "none",
                }}
              >
                {isCenter ? (
                  <Link
                    href={{
                      pathname: "/catalog",
                      query: {
                        otherfilters: encodeURIComponent(
                          JSON.stringify({
                            deal: "Оренда",
                            category: "Житлова",
                          }) // 👈 пример
                        ),
                        locationfilters: encodeURIComponent(
                          JSON.stringify({ districts: slide.text }) // 👈 сюда район
                        ),
                      },
                    }}
                    className={styles.linkWrapper}
                  >
                    <img
                      src={slide.src}
                      alt={slide.name}
                      className={styles.slideImage}
                    />
                    <div className={styles.textOverlay} />
                    <div className={styles.slideTextContainer}>
                      <span className={styles.slideSubtitle}>
                        {t("district")}
                      </span>
                      <span className={styles.slideTitle}>{slideText}</span>
                    </div>
                  </Link>
                ) : (
                  <img
                    src={slide.src}
                    alt={slide.name}
                    className={styles.slideImage}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {(!isMobile || (isMobile && slidesData.length > 2)) && (
        <div className={styles.arrows}>
          <button
            onClick={prevSlide}
            className={`${styles.arrowBtn} ${styles.leftArrow}`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 10 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.33203 14.668L8.00003 8.00003L1.33203 1.33203"
                stroke="#03B9B3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className={`${styles.arrowBtn} ${styles.rightArrow}`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 10 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.33203 14.668L8.00003 8.00003L1.33203 1.33203"
                stroke="#03B9B3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Carousel;
