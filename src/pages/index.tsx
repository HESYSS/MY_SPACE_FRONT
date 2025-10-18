import RealEstateCategories from "./main/RealEstateCategories";
import OurValues from "@/components/Principles";
import styles from "./main/main.module.css";
import CoworkingSection from "./main/CoworkingSection";
import ImageCarousel from "./main/ImageCarousel";
import VideoSearchOverlay from "./main/VideoSearchOverlay";
import { useTranslation } from "react-i18next"; // Импортируем хук

export default function HomePage() {
  const { t } = useTranslation("common");
  return (
    <div className={styles.mainDiv}>
      <VideoSearchOverlay />
      <div className={styles.mainP}>
        <div className={styles.lightEffect1}></div>
        <div className={styles.titleMain}>
          <h2 className={styles.mainTitle}>{t("kyivDistrictsTitle")}</h2>
          <div className={styles.line9}></div>
        </div>
      </div>

      <ImageCarousel />

      <RealEstateCategories />
      <div className={styles.mainP}>
        <div className={styles.titleMain}>
          <h2 className={styles.mainTitle}>{t("aboutUsTitle")}</h2>
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
