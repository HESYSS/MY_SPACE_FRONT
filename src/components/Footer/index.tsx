// components/Footer/Footer.jsx

import styles from "./footer.module.css";
import mySpaceLogo from "../../../public/icons/MySpace_LOGO_1[SVG].png";
import youtubeIcon from "../../../public/icons/youtube.svg";
import instagramIcon from "../../../public/icons/instagram.svg";
import { useTranslation } from "react-i18next"; // Импортируем хук

export default function Footer() {
  const { t } = useTranslation('common'); // Используем файл common.json

  return (
    <footer className={styles.footer}>
      <div className={styles.mainContent}>
        <div className={styles.logoSection}>
          <img src={mySpaceLogo.src} alt="MySpace Logo" />
          <p className={styles.copyright}>
            {t('copyright')}
          </p>
        </div>
        <div className={styles.menuSection}>
          <h4 className={styles.footerHeading}>{t('menuHeading')}</h4>
          <ul className={styles.footerLinks}>
            <li>
              <a href="/">{t('home')}</a>
            </li>
            <li>
              <a href="/team">{t('ourTeam')}</a>
            </li>
          </ul>
        </div>
        <div className={styles.infoSection}>
          <h4 className={styles.footerHeading}>{t('infoHeading')}</h4>
          <ul className={styles.footerLinks}>
            <li>
              <a href="/policy">{t('privacyPolicy')}</a>
            </li>
          </ul>
        </div>
        <div className={styles.contactSection}>
          <h4 className={styles.footerHeading}>{t('contactHeading')}</h4>
          <ul className={styles.footerLinks}>
            <li>
              <a href="/contacts">{t('contacts')}</a>
            </li>
            <li>
              <a href="mailto:office@myspace.in.ua">{t('email')}</a>
            </li>
            <li>
              <a href="tel:+380687777337">{t('phoneFooter')}</a>
            </li>
          </ul>
          <div className={styles.socialIcons}>
            <a href="https://www.youtube.com/@MySpace-kyiv" target="_blank" rel="noopener noreferrer">
              <img src={youtubeIcon.src} alt="YouTube" className={styles.socialIcon} />
            </a>
            <a href="https://www.instagram.com/myspace.kyiv" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon.src} alt="Instagram" className={styles.socialIcon} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}