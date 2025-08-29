// components/Header/Header.tsx
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.css";
import mySpaceLogo from "../../../public/icons/MySpace_LOGO_1[SVG].png";
import ConsultationModal from "./ConsultationModal/ConsultationModal";
import { useState, FC } from "react";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

const Header: FC = () => {
  const { t } = useTranslation("common"); // 'common.json'
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.leftNav}>
          <div className={styles.logo}>
            <Link href="/main">
              <Image
                src={mySpaceLogo}
                alt="MySpace Logo"
                width={150}
                height={50}
              />
            </Link>
          </div>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/catalog/sale">{t("sale") || "Продаж"}</Link>
            </li>
            <li>
              <Link href="/catalog/rent" className={styles.activeLink}>
                {t("rent") || "Оренда"}
              </Link>
            </li>
            <li>
              <Link href="/team">{t("ourTeam") || "Наша команда"}</Link>
            </li>
            <li>
              <Link href="/contacts">{t("contacts") || "Контакти"}</Link>
            </li>
          </ul>
        </div>

        <div className={styles.navRight}>
          <p className={styles.ctaButton} onClick={() => setModalOpen(true)}>
            {t("consultation") || "Консультація"}
          </p>
          <div className={styles.contactInfo}>
            <LanguageSwitcher />
            <a href="tel:+3801234567" className={styles.phone}>
              {t("phoneNumber") || "+3801234567"}
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
};

export default Header;
