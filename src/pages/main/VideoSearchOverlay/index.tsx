import React, { useRef, useState, useEffect } from "react";
import styles from "./style.module.css";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useRouter } from "next/router";

const VideoSearchOverlay = () => {
  const { t } = useTranslation("common");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<"rent" | "sale">("rent");
  const [category, setCategory] = useState("residential");
  const [region, setRegion] = useState("kyiv");

  const router = useRouter();

  const backendUrl = process.env.REACT_APP_API_URL;
  const apiUrl = `${backendUrl}/images/videoMain.mp4`;

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(apiUrl);
        setVideoUrl(response.data.url);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };
    fetchVideo();
  }, []);

  const handleSearch = () => {
    router.push({
      pathname: `/catalog/${serviceType}`,
      query: { category, region },
    });
  };

  return (
    <>
      <div className={styles.hero}>
        {videoUrl ? (
          <video ref={videoRef} className={styles.video} autoPlay loop muted>
            <source src={videoUrl} type="video/mp4" />
            {t("videoNotSupported")}
          </video>
        ) : (
          <div className={styles.videoPlaceholder}>Loading video...</div>
        )}

        <div className={styles.heroTitleContainer}>
          <h1 className={styles.heroTitle}>{t("heroTitle")}</h1>
        </div>
      </div>

      <div className={styles.searchFormContainer}>
        <div className={styles.searchForm}>
          <div className={styles.dropdown}>
            <label htmlFor="serviceType">{t("serviceTypeLabel")}</label>
            <select
              id="serviceType"
              value={serviceType}
              onChange={(e) =>
                setServiceType(e.target.value as "rent" | "sale")
              }
            >
              <option value="rent">{t("serviceRent")}</option>
              <option value="sale">{t("serviceSale")}</option>
            </select>
          </div>

          <div className={styles.dropdown}>
            <label htmlFor="category">{t("categoryLabel")}</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="residential">{t("categoryResidential")}</option>
              <option value="commercial">{t("categoryCommercial")}</option>
            </select>
          </div>

          <div className={styles.dropdown}>
            <label htmlFor="region">{t("regionLabel")}</label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="kyiv">{t("regionKyiv")}</option>
              <option value="kyivRegion">{t("Kyiv region")}</option>
            </select>
          </div>

          <div className={styles.searchBtnWrapper}>
            <button className={styles.searchButton} onClick={handleSearch}>
              {t("searchButton")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoSearchOverlay;
