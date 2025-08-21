import RealEstateCategories from "./RealEstateCategories";
import OurValues from "@/components/Principles";
import styles from "./main.module.css";
import CoworkingSection from "./CoworkingSection";
import ImageCarousel from "./ImageCarousel";
import VideoSearchOverlay from "./VideoSearchOverlay";

export default function HomePage() {
  const images = [
    "/images/house1.jpg",
    "/images/house2.jpg",
    "/images/house3.jpg",
  ];

  return (
    <div className={styles.mainDiv}>
      <VideoSearchOverlay />
      <div className={styles.mainP}>
        <div className={styles.lightEffect1}></div>
        <div className={styles.titleMain}>
          <h2 className={styles.mainTitle}>РАЙОНИ КИЄВА</h2>
          <div className={styles.line9}></div>
        </div>
      </div>

      <ImageCarousel />

      <RealEstateCategories />
      <div className={styles.mainP}>
        <div className={styles.titleMain}>
          <h2 className={styles.mainTitle}>ПРО НАС</h2>
          <div className={styles.line8}></div>
        </div>
      </div>
      <div className={styles.aboutUsContainer}>
        <div className={styles.lightEffect}></div>
        <OurValues />
      </div>
      <CoworkingSection />
    </div>
  );
}
