import { FC, useState, useRef, useEffect, useMemo, useCallback } from "react";
import styles from "./style.module.css";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";

// ✅ Кастомный хук для отслеживания ширины экрана
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
};

interface SiteImage {
  id: number;
  name: string;
  url: string;
}

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

  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Свайпы
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);
  const swipeThreshold = 50;

  // Данные слайдов
  const baseSlidesData = useMemo(
    () => [
      { name: "Solomianskyi.png", text: "Солом'янський", text_en: "Solomianskyi" },
      { name: "Podilskyi.png", text: "Подільський", text_en: "Podilskyi" },
      { name: "Pecherskyi.png", text: "Печерський", text_en: "Pecherskyi" },
      { name: "Dniprovskyi.png", text: "Дніпровський", text_en: "Dniprovskyi" },
      { name: "Shevchenkivskyi.png", text: "Шевченківський", text_en: "Shevchenkivskyi" },
      { name: "Holosiivskyi.png", text: "Голосіївський", text_en: "Holosiivskyi" },
      { name: "Obolonskyi.png", text: "Оболонський", text_en: "Obolonskyi" },
      { name: "Darnytskyi.png", text: "Дарницький", text_en: "Darnytskyi" },
      { name: "Desnianskyi.png", text: "Деснянський", text_en: "Desnianskyi" },
      { name: "Sviatoshynskyi.png", text: "Святошинський", text_en: "Sviatoshynskyi" },
    ],
    []
  );

  const slidesData = useMemo<CarouselSlide[]>(() => {
    const getImageUrlByName = (name: string): string => {
      const img = images.find((i) => i.name === name);
      return img ? img.url : "";
    };
    return baseSlidesData.map((s) => ({ ...s, src: getImageUrlByName(s.name) }));
  }, [baseSlidesData, images]);

  const loopSlides = useMemo(() => [...slidesData, ...slidesData, ...slidesData], [slidesData]);

  // Автопрокрутка
  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (slidesData.length === 0) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => prev + 1);
    }, 10000);
  }, [slidesData.length]);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startTimer();
  }, [startTimer]);

  // Управление слайдами
  const prevSlide = useCallback(() => {
    if (!slidesData.length) return;
    setActiveIndex((prev) => prev - 1);
    resetTimer(); // 🔁 сброс таймера при ручном действии
  }, [slidesData.length, resetTimer]);

  const nextSlide = useCallback(() => {
    if (!slidesData.length) return;
    setActiveIndex((prev) => prev + 1);
    resetTimer(); // 🔁 сброс таймера при ручном действии
  }, [slidesData.length, resetTimer]);

  // Свайпы
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      touchEndRef.current = e.changedTouches[0].clientX;
      const diff = touchStartRef.current - touchEndRef.current;
      if (diff > swipeThreshold) {
        nextSlide();
      } else if (diff < -swipeThreshold) {
        prevSlide();
      }
    },
    [nextSlide, prevSlide]
  );

  // Загрузка данных
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const backendUrl = process.env.REACT_APP_API_URL;
        const res = await fetch(`${backendUrl}/images`);
        if (!res.ok) throw new Error(res.statusText);
        const data: SiteImage[] = await res.json();
        setImages(data);
        if (data.length > 0) setActiveIndex(baseSlidesData.length);
      } catch (err) {
        console.error("Ошибка загрузки изображений:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [baseSlidesData]);

  // Циклический переход
  useEffect(() => {
    if (!slidesData.length) return;
    if (!containerRef.current) return;

    if (activeIndex <= slidesData.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex((prev) => prev + slidesData.length);
      }, 500);
    } else if (activeIndex >= slidesData.length * 2) {
      setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex((prev) => prev - slidesData.length);
      }, 500);
    } else {
      setIsTransitioning(true);
    }
  }, [activeIndex, slidesData]);

  // Запуск таймера
  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTimer]);

  // Расчёт стилей
  const getPositionStyle = useCallback(
    (index: number) => {
      const layerGap = -40;
      const mobileLayerGap = -15;
      const offset = index - activeIndex;
      const absOffset = Math.abs(offset);
      const currentGap = isMobile ? mobileLayerGap : layerGap;

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
            return { opacity: 0 };
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
            return { opacity: 0 };
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
            return { opacity: 0 };
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
        translateX += (prevW + currW) / 2 + currentGap;
      }

      if (offset < 0) translateX = -translateX;
      translateX -= width / 2;

      return { width, height, opacity, zIndex, translateX, rotateY };
    },
    [activeIndex, isMobile, isTablet]
  );

  if (loading) return <div>Загрузка...</div>;
  if (!slidesData.length) return null;

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselWrapper}>
        <div
          ref={containerRef}
          className={styles.slidesContainer}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {loopSlides.map((slide, idx) => {
            const { width, height, opacity, zIndex, translateX, rotateY } = getPositionStyle(idx);
            if (opacity === 0) return null;
            const isCenter = zIndex === 10;
            const slideText = currentLanguage === "en" ? slide.text_en : slide.text;

            return (
              <div
                key={`${slide.name}-${idx}`}
                className={`${styles.slide} ${isCenter ? styles.centerSlide : ""}`}
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
                          JSON.stringify({ deal: "Продаж", category: "Житлова" })
                        ),
                        locationfilters: encodeURIComponent(
                          JSON.stringify({ districts: slide.text })
                        ),
                      },
                    }}
                    className={styles.linkWrapper}
                  >
                  <Image
  src={slide.src}
  alt={slide.name}
  fill
  sizes="(max-width: 480px) 250px,
         (max-width: 768px) 300px,
         (max-width: 1200px) 400px,
         500px"
  className={styles.slideImage}
/>
                    <div className={styles.textOverlay} />
                    <div className={styles.slideTextContainer}>
                      <span className={styles.slideSubtitle}>{t("district")}</span>
                      <span className={styles.slideTitle}>{slideText}</span>
                    </div>
                  </Link>
                ) : (
              <Image
  src={slide.src}
  alt={slide.name}
  fill
  sizes="(max-width: 480px) 250px,
         (max-width: 768px) 300px,
         (max-width: 1200px) 400px,
         500px"
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
          <button onClick={prevSlide} className={`${styles.arrowBtn} ${styles.leftArrow}`}>
            <svg width="18" height="18" viewBox="0 0 10 16" fill="none">
              <path
                d="M1.33203 14.668L8.00003 8.00003L1.33203 1.33203"
                stroke="#03B9B3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button onClick={nextSlide} className={`${styles.arrowBtn} ${styles.rightArrow}`}>
            <svg width="18" height="18" viewBox="0 0 10 16" fill="none">
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
