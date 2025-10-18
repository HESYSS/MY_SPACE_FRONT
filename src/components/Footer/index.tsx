import styles from "./footer.module.css";
import Link from "next/link";
import mySpaceLogo from "../../../public/icons/MySpace_LOGO_1.png";
import youtubeIcon from "../../../public/icons/youtube.svg";
import instagramIcon from "../../../public/icons/instagram.svg";

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("common");

  return (
    <footer className={styles.footer}>
      <div className={styles.mainContent}>
        <div className={styles.logoSection}>
          <img src={mySpaceLogo.src} alt="MySpace Logo" />
          <p className={styles.copyright}>{t("copyright")}</p>
        </div>
        <div className={styles.menuSection}>
          <h4 className={styles.footerHeading}>{t("menuHeading")}</h4>
          <ul className={styles.footerLinks}>
            <li>
               <Link href="/">{t("home")}</Link>
            </li>
            <li>
              <Link href="/team">{t("ourTeam")}</Link>
            </li>
          </ul>
        </div>
        <div className={styles.infoSection}>
          <h4 className={styles.footerHeading}>{t("infoHeading")}</h4>
          <ul className={styles.footerLinks}>
            <li>
              <Link href="/policy">{t("privacyPolicy")}</Link>
            </li>
          </ul>
        </div>
        <div className={styles.contactSection}>
          <h4 className={styles.footerHeading}>{t("contactHeading")}</h4>
          <ul className={styles.footerLinks}>
            <li>
              <Link href="/contacts">{t("contacts")}</Link>
            </li>
            <li>
              <Link href="mailto:office@myspace.in.ua">{t("email")}</Link>
            </li>
            <li>
              <Link href="tel:+380687777337">{t("phoneFooter")}</Link>
            </li>
          </ul>
          <div className={styles.socialIcons}>
            <a
              href="https://www.youtube.com/@MySpace-kyiv"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={youtubeIcon.src}
                alt="YouTube"
                className={styles.socialIcon}
              />
            </a>
            <a
              href="https://www.instagram.com/myspace.kyiv"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={instagramIcon.src}
                alt="Instagram"
                className={styles.socialIcon}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
