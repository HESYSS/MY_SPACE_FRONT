// components/Header/Header.jsx

import Link from 'next/link';
import { useTranslation } from 'react-i18next'; // Используем react-i18next
import styles from './styles.module.css';
import mySpaceLogo from "../../../public/icons/MySpace_LOGO_1[SVG].png";
import ConsultationModal from "./ConsultationModal/ConsultationModal";
import { useState } from "react";
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation('common'); // 'common' - это имя файла перевода (common.json)
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.leftNav}>
          <div className={styles.logo}>
            <Link href="/">
              <img src={mySpaceLogo.src} alt="MySpace Logo" />
            </Link>
          </div>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/sale">{t('sale')}</Link>
            </li>
            <li>
              <Link href="/rent" className={styles.activeLink}>{t('rent')}</Link>
            </li>
            <li>
              <Link href="/team">{t('ourTeam')}</Link>
            </li>
            <li>
              <Link href="/contacts">{t('contacts')}</Link>
            </li>
          </ul>
        </div>
        <div className={styles.navRight}>
          <p
            className={styles.ctaButton}
            onClick={() => setModalOpen(true)}
          >
            {t('consultation')}
          </p>
          <div className={styles.contactInfo}>
            <LanguageSwitcher />
            <a href="tel:+3801234567" className={styles.phone}>
              {t('phoneNumber')}
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