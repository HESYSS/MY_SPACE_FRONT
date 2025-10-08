import React, { useState } from "react";
import Image from "next/image";
import styles from "./PropertyImagesGallery.module.css";

// --- Интерфейсы ---

interface PropertyImage {
  id: number;
  url: string;
  order?: number;
  isActive?: boolean;
}

interface Props {
  images: PropertyImage[];
  onImageClick: (url: string) => void;
}

// --- Компонент Модального Окна (ImageModal) ---

const ImageModal = ({
  images,
  onClose,
  initialIndex, // Добавлено: начальный индекс для открытия
}: {
  images: PropertyImage[];
  onClose: () => void;
  initialIndex: number; // Добавлено: начальный индекс
}) => {
  // Используем initialIndex как начальное состояние
  const [modalImageIndex, setModalImageIndex] = useState(initialIndex);

  const nextImage = () => {
    setModalImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setModalImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Проверка на нажатие Escape для закрытия модального окна
  React.useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [onClose, nextImage, prevImage]);


  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseButton} onClick={onClose} aria-label="Закрыть">
          &times;
        </button>
        <div className={styles.modalSlider}>
          {/* Увеличенное изображение */}
          <div className={styles.largeImageWrapper}>
            <Image
              src={images[modalImageIndex].url}
              alt="Увеличенное изображение"
              layout="fill"
              objectFit="contain"
              sizes="(max-width: 768px) 100vw, 800px" // Увеличил максимальный размер для модального окна
            />
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={prevImage}
              aria-label="Предыдущее изображение"
            >
              &#10094;
            </button>
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={nextImage}
              aria-label="Следующее изображение"
            >
              &#10095;
            </button>
          </div>

          {/* Горизонтальная прокручиваемая галерея миниатюр */}
          <div className={styles.thumbnailSlider}>
            {images.map((img, index) => (
              <div
                key={img.id}
                className={`${styles.modalThumbnail} ${
                  index === modalImageIndex ? styles.activeModalThumbnail : ""
                }`}
                onClick={() => setModalImageIndex(index)}
                aria-label={`Перейти к изображению ${index + 1}`}
              >
                <Image
                  src={img.url}
                  alt={`Миниатюра ${img.id}`}
                  layout="fill"
                  objectFit="cover"
                  sizes="100px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Основной Компонент Галереи (PropertyImagesGallery) ---

const PropertyImagesGallery: React.FC<Props> = ({ images, onImageClick }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const sortedImages = images
    .filter((img) => img.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    
  if (sortedImages.length === 0) return null;

  const mainImage = sortedImages[currentImageIndex];
  // Миниатюры: берем первые 3 изображения, которые не являются основным
  const thumbnails = sortedImages.filter((_, index) => index !== currentImageIndex).slice(0, 3);
  
  // Определяем, какие индексы соответствуют этим миниатюрам
  const thumbnailIndices = sortedImages
    .map((_, index) => index)
    .filter((index) => index !== currentImageIndex)
    .slice(0, 3);

  // Количество оставшихся изображений для кнопки "Еще фото"
  const remainingImagesCount = sortedImages.length > 4 ? sortedImages.length - 1 : 0; 
  // Корректировка, чтобы кнопка показывала все остальные, если их > 0
  const totalThumbnailsShown = 1 + thumbnailIndices.length;
  const viewAllCount = sortedImages.length - totalThumbnailsShown;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === sortedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? sortedImages.length - 1 : prevIndex - 1
    );
  };
  
  // Функция для открытия модального окна
  const openModal = () => {
    setShowModal(true);
  };

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.imagesBlock}>
        <div className={styles.mainImageWrapper}>
          {/* Основное изображение */}
          <Image
            src={mainImage.url}
            alt="Основное изображение объекта"
            layout="fill"
            objectFit="cover"
            className={styles.mainImage}
            // Удаляем onClick, чтобы избежать конфликта с кнопкой "Увеличить"
            // или оставляем, если клик по изображению тоже должен открывать модалку
            // onClick={openModal} // Можно добавить, чтобы клик по картинке тоже увеличивал
          />
          
          {/* Кнопка "Увеличить" */}
          <button
            className={styles.zoomButton}
            onClick={openModal}
            title="Увеличить изображение"
            aria-label="Увеличить изображение"
          >
            &#x1F50E; {/* Иконка увеличительного стекла */}
          </button>

          {/* Кнопки навигации */}
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Предыдущее изображение"
          >
            &#10094;
          </button>
          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Следующее изображение"
          >
            &#10095;
          </button>
        </div>
        
        {/* Миниатюры */}
        <div className={styles.thumbnails}>
          {thumbnails.map((img, index) => {
            // Фактический индекс изображения в sortedImages
            const actualIndex = thumbnailIndices[index]; 

            return (
              <div
                key={img.id}
                className={`${styles.thumbnailWrapper} ${
                  actualIndex === currentImageIndex ? styles.activeThumbnail : ""
                }`}
                onClick={() => setCurrentImageIndex(actualIndex)}
              >
                <Image
                  src={img.url}
                  alt={`Миниатюра ${img.id}`}
                  layout="fill"
                  objectFit="cover"
                  className={styles.thumbnail}
                />
              </div>
            );
          })}
          
          {/* Кнопка "Еще фото" */}
          {viewAllCount > 0 && (
            <button
              className={styles.viewAllButton}
              onClick={openModal}
            >
              {`Ще ${viewAllCount} фото`}
            </button>
          )}
        </div>
      </div>
      
      {/* Модальное окно */}
      {showModal && (
        <ImageModal
          images={sortedImages}
          onClose={() => setShowModal(false)}
          initialIndex={currentImageIndex} // Передаем текущий индекс
        />
      )}
    </div>
  );
};

export default PropertyImagesGallery;