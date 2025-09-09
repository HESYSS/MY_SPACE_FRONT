import { FC, useState, useRef, useEffect } from "react";
import styles from "./style.module.css";

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

const slidesData = [
  { src: "/images/test-1.png", text: "Солом'янський" },
  { src: "/images/test-2.png", text: "Подільський" },
  { src: "/images/test-3.png", text: "Печерський" },
  { src: "/images/test-4.png", text: "Дніпровський" },
  { src: "/images/test-5.png", text: "Шевченківський" },
  { src: "/images/test-6.png", text: "Голосіївський" },
  { src: "/images/test-7.png", text: "Оболонський" },
  { src: "/images/test.png", text: "Дарницький" },
];

const Carousel: FC = () => {
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1300px)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeIndex, setActiveIndex] = useState(slidesData.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loopSlides = [...slidesData, ...slidesData, ...slidesData];
  const layerGap = -40;
  const mobileLayerGap = -15;

  const startTimer = () => {
    intervalRef.current = setInterval(() => nextSlide(), 10000);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startTimer();
  };

  const prevSlide = () => {
    setActiveIndex((prev) => prev - 1);
    resetTimer();
  };

  const nextSlide = () => {
    setActiveIndex((prev) => prev + 1);
    resetTimer();
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
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
  }, [activeIndex]);

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
      let prevW = 0, currW = 0;
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

  return (
    <div className={styles.carouselWrapper}>
      {!isMobile && (
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

      <div ref={containerRef} className={styles.slidesContainer}>
        {loopSlides.map((slide, idx) => {
          const { width, height, opacity, zIndex, translateX, rotateY } =
            getPositionStyle(idx);
          
          if ((isTablet || isMobile) && Math.abs(idx - activeIndex) > 1) {
            return null;
          }

          if (opacity === 0) return null;

          const isCenter = zIndex === 10;

          return (
            <div
              key={idx}
              className={`${styles.slide} ${isCenter ? styles.centerSlide : ''}`}
              style={{
                width,
                height,
                transform: `translateX(${translateX}px) translateY(-50%) rotateY(${rotateY}deg)`,
                zIndex,
                opacity,
                transition: isTransitioning ? "all 0.7s ease" : "none",
              }}
            >
              <img
                src={slide.src}
                alt={`slide-${idx}`}
                className={styles.slideImage}
              />
              {isCenter && (
                <>
                  <div className={styles.textOverlay} />
                  <div className={styles.slideTextContainer}>
                    <span className={styles.slideSubtitle}>РАЙОН</span>
                    <span className={styles.slideTitle}>{slide.text}</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;