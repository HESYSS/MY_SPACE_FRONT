import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import mySpaceLogo from "../../../public/icons/MySpace_LOGO_1[SVG].png";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.leftNav}>
          <div className={styles.logo}>
            <Link to="/">
              <img src={mySpaceLogo.src} alt="MySpace Logo" />
            </Link>
          </div>
          <ul className={styles.navLinks}>
            <li>
              <Link to="/sale">{`ПРОДАЖ`}</Link>
            </li>
            <li>
              <Link to="/rent" className={styles.activeLink}>{`ОРЕНДА`}</Link>
            </li>
            <li>
              <Link to="/team">{`НАША КОМАНДА`}</Link>
            </li>
            <li>
              <Link to="/contacts">{`КОНТАКТИ`}</Link>
            </li>
          </ul>
        </div>
        <div className={styles.navRight}>
          <a href="#" className={styles.ctaButton}>
            {`КОНСУЛЬТАЦІЯ`}
          </a>
          <div className={styles.contactInfo}>
            <span className={styles.langSelector}>{`UA`}</span>
            <a href="tel:+3801234567" className={styles.phone}>
              {`+380 123 4567`}
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
