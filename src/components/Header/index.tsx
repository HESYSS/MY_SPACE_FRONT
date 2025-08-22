import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import mySpaceLogo from "../../../public/icons/MySpace_LOGO_1[SVG].png";
import ConsultationModal from "./ConsultationModal/ConsultationModal";
import { useState } from "react";

export default function Header() {
  const [isModalOpen, setModalOpen] = useState(false);
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
          <p
            className={styles.ctaButton}
            onClick={() => setModalOpen(true)}
          >{`КОНСУЛЬТАЦІЯ`}</p>
          <div className={styles.contactInfo}>
            <span className={styles.langSelector}>{`UA`}</span>
            <a href="tel:+3801234567" className={styles.phone}>
              {`+380 123 4567`}
            </a>
          </div>
        </div>
      </nav>
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </header>
  );
}
