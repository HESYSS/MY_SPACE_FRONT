import styles from "./footer.module.css";
import mySpaceLogo from "../../../public/icons/MySpace_LOGO_1[SVG].png";
import youtubeIcon from "../../../public/icons/youtube.svg";
import instagramIcon from "../../../public/icons/instagram.svg";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.mainContent}>
        <div className={styles.logoSection}>
          <img src={mySpaceLogo.src} alt="MySpace Logo" />
          <p className={styles.copyright}>
            Copyright © 2025 myspace.in.ua
          </p>
        </div>
        <div className={styles.menuSection}>
          <h4 className={styles.footerHeading}>Меню</h4>
          <ul className={styles.footerLinks}>
            <li>
              <a href="/">{`ГОЛОВНА`}</a>
            </li>
            <li>
              <a href="/team">{`НАША КОМАНДА`}</a>
            </li>
          </ul>
        </div>
        <div className={styles.infoSection}>
          <h4 className={styles.footerHeading}>Інформація</h4>
          <ul className={styles.footerLinks}>
            <li>
              <a href="/privacy">{`ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ`}</a>
            </li>
          </ul>
        </div>
        <div className={styles.contactSection}>
          <h4 className={styles.footerHeading}>Зв’язок</h4>
          <ul className={styles.footerLinks}>
            <li>
              <a href="/contacts">{`КОНТАКТИ`}</a>
            </li>
            <li>
              <a href="mailto:office@myspace.in.ua">{`office@myspace.in.ua`}</a>
            </li>
            <li>
              <a href="tel:+380687777337">{`+380 68 777 73 37`}</a>
            </li>
          </ul>
          <div className={styles.socialIcons}>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <img src={youtubeIcon.src} alt="YouTube" className={styles.socialIcon} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon.src} alt="Instagram" className={styles.socialIcon} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}