import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import mySpaceLogo from "../../../public/icons/MySpace_LOGO_1[SVG].png"; // Убедитесь, что путь к вашему логотипу верный

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img src={mySpaceLogo.src} alt="MySpace Logo" />
        </div>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/">{`Головна`}</Link>
          </li>
          <li>
            <Link to="/catalog/rent">{`Оренда`}</Link>
          </li>
          <li>
            <Link to="/catalog/sale">{`Продаж`}</Link>
          </li>
          <li>
            <Link to="/team">{`Наша команда`}</Link>
          </li>
          <li>
            <Link to="/about">{`Про нас`}</Link>
          </li>
          <li>
            <Link to="/contacts">{`Контакти`}</Link>
          </li>
        </ul>
        <div className={styles.navRight}>
          <a href="#" className={styles.ctaButton}>
            {`КОНСУЛЬТАЦІЯ`}
          </a>
          <div className={styles.contactInfo}>
            <span className={styles.langSelector}>{`UA `}</span>
            <a href="tel:+3801234567" className={styles.phone}>
              {`+380 123 4567`}
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
