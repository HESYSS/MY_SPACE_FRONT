// PropertyImagesGallery.tsx
import React from "react";
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

const PropertyImagesGallery: React.FC<Props> = ({ images, onImageClick }) => {
  if (!images || images.length === 0) return null;

  const sortedImages = images
    .filter((img) => img.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.imagesGrid}>
        {sortedImages.map((img) => (
          <div
            key={img.id}
            className={styles.imageWrapper}
            onClick={() => onImageClick(img.url)}
          >
            <Image
              src={img.url}
              alt={`Property Image ${img.id}`}
              objectFit="cover"
              className={styles.image}
              width={800}
              height={600}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyImagesGallery;
