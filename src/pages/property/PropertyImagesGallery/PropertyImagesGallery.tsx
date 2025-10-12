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
  initialIndex,
}: {
  images: PropertyImage[];
  onClose: () => void;
  initialIndex: number;
}) => {
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
          <div className={styles.largeImageWrapper}>
            <Image
              src={images[modalImageIndex].url}
              alt="Увеличенное изображение"
              layout="fill"
              objectFit="contain"
              sizes="(max-width: 768px) 100vw, 800px"
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
const PropertyImagesGallery: React.FC<Props> = ({ images, onImageClick }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const sortedImages = images
    .filter((img) => img.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    
  if (sortedImages.length === 0) return null;

  const mainImage = sortedImages[currentImageIndex];
  const thumbnails = sortedImages.filter((_, index) => index !== currentImageIndex).slice(0, 3);
    const thumbnailIndices = sortedImages
    .map((_, index) => index)
    .filter((index) => index !== currentImageIndex)
    .slice(0, 3);
  const remainingImagesCount = sortedImages.length > 4 ? sortedImages.length - 1 : 0; 
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
    const openModal = () => {
    setShowModal(true);
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
            className={styles.mainImage}/>
          
          <button
            className={styles.zoomButton}
            onClick={openModal}
            title="Увеличить изображение"
            aria-label="Увеличить изображение"
          >
            &#x1F50E;
          </button>
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
        
        <div className={styles.thumbnails}>
          {thumbnails.map((img, index) => {
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
      
      {showModal && (
        <ImageModal
          images={sortedImages}
          onClose={() => setShowModal(false)}
          initialIndex={currentImageIndex}
        />
      )}
    </div>
  );
};

export default PropertyImagesGallery;