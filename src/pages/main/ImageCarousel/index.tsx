import { FC, useState, useRef, useEffect } from "react";
import styles from "./style.module.css";
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
  const [activeIndex, setActiveIndex] = useState(slidesData.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null); // хранение таймера

  const loopSlides = [...slidesData, ...slidesData, ...slidesData];
  const layerGap = -40;

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

    let width = 0,
      height = 0,
      opacity = 0,
      zIndex = 0,
      rotateY = 0;

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

    let translateX = 0;
    for (let i = 1; i <= absOffset; i++) {
      const prevW = i === 1 ? 400 : i === 2 ? 320 : 240;
      const currW = i === 1 ? 320 : i === 2 ? 240 : 240;

      if (zIndex === 5) {
        translateX += (prevW + currW) / 2 + layerGap * 3;
      } else if (zIndex === 7) {
        translateX += (prevW + currW) / 2 + layerGap * 2;
      } else {
        translateX += (prevW + currW) / 2 + layerGap;
      }
    }
    if (offset < 0) translateX = -translateX;
    translateX -= width / 2;

    return { width, height, opacity, zIndex, translateX, rotateY };
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "1200px",
        height: "552px",
        margin: "0 auto",
        overflow: "hidden",
        perspective: "1200px",
        zIndex: 1, // Ensure carousel is above other content
      }}
    >
      <div className={styles.arrows}>
        {/* Влево */}
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

        {/* Вправо */}
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

      <div
        ref={containerRef}
        className="relative"
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          height: "551px",
        }}
      >
        {loopSlides.map((slide, idx) => {
          const { width, height, opacity, zIndex, translateX, rotateY } =
            getPositionStyle(idx);

          if (opacity === 0) return null;

          return (
            <div
              key={idx}
              style={{
                width,
                height,
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translateX(${translateX}px) translateY(-50%) rotateY(${rotateY}deg)`,
                zIndex,
                opacity,
                transition: isTransitioning ? "all 0.7s ease" : "none",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow:
                  zIndex === 10
                    ? "0 15px 30px rgba(0,0,0,0.4)"
                    : "0 5px 15px rgba(0,0,0,0.2)",
              }}
            >
              <img
                src={slide.src}
                alt={`slide-${idx}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {zIndex === 10 && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "80%",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,1) 1%, rgba(0,0,0,0.01) 100%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        opacity: 0.8,
                        marginBottom: "5px",
                        display: "block",
                      }}
                    >
                      РАЙОН
                    </span>
                    <span
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                      }}
                    >
                      {slide.text}
                    </span>
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
