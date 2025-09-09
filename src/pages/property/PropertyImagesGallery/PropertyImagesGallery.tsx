import React, { useState } from "react";
import Image from "next/image";
import styles from "./PropertyImagesGallery.module.css";

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

const ImageModal = ({
  images,
  onClose,
}: {
  images: PropertyImage[];
  onClose: () => void;
}) => {
  const [modalImageIndex, setModalImageIndex] = useState(0);

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

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseButton} onClick={onClose}>
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
            />
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={prevImage}
            >
              &#10094;
            </button>
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={nextImage}
            >
              &#10095;
            </button>
          </div>

          {/* Горизонтальная прокручиваемая галерея */}
          <div className={styles.thumbnailSlider}>
            {images.map((img, index) => (
              <div
                key={img.id}
                className={`${styles.modalThumbnail} ${
                  index === modalImageIndex ? styles.activeModalThumbnail : ""
                }`}
                onClick={() => setModalImageIndex(index)}
              >
                <Image
                  src={img.url}
                  alt={`Миниатюра ${img.id}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ... Остальная часть компонента PropertyImagesGallery остается без изменений
const PropertyImagesGallery: React.FC<Props> = ({ images, onImageClick }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const sortedImages = images
    .filter((img) => img.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const mainImage = sortedImages[currentImageIndex];
  const thumbnails = sortedImages.slice(1, 4);
  const remainingImagesCount =
    sortedImages.length > 4 ? sortedImages.length - 4 : 0;

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

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.imagesBlock}>
        <div className={styles.mainImageWrapper}>
          <Image
            src={mainImage.url}
            alt="Основное изображение объекта"
            layout="fill"
            objectFit="cover"
            className={styles.mainImage}
            onClick={() => onImageClick(mainImage.url)}
          />
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            &#10094;
          </button>
          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            &#10095;
          </button>
        </div>
        <div className={styles.thumbnails}>
          {thumbnails.map((img, index) => (
            <div
              key={img.id}
              className={`${styles.thumbnailWrapper} ${
                index + 1 === currentImageIndex ? styles.activeThumbnail : ""
              }`}
              onClick={() => setCurrentImageIndex(index + 1)}
            >
              <Image
                src={img.url}
                alt={`Миниатюра ${img.id}`}
                layout="fill"
                objectFit="cover"
                className={styles.thumbnail}
              />
            </div>
          ))}
          {remainingImagesCount > 0 && (
            <button
              className={styles.viewAllButton}
              onClick={() => setShowModal(true)}
            >
              {`Ще ${remainingImagesCount} фото`}
            </button>
          )}
        </div>
      </div>
      {showModal && (
        <ImageModal images={sortedImages} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default PropertyImagesGallery;