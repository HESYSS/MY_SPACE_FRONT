import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { FC, useState } from "react";
import styles from "./styles.module.css";
import mySpaceLogo from "../../../public/icons/MySpace_LOGO_1[SVG].png";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { useModal } from "../../hooks/useModal";

const Header: FC = () => {
  const { t } = useTranslation("common");
  const { openModal } = useModal();
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const handleOpenModal = () => {
    openModal(null);
    setMenuOpen(false);
  };

  const category = "Житлова";
  const type = "Квартира";

  // Ссылки на каталог без пустых массивов
  const catalogLinkSale = {
    pathname: "/catalog",
    query: {
      otherfilters: encodeURIComponent(
        JSON.stringify({ deal: "Продаж", category, type })
      ),
    },
  };

  const catalogLinkRent = {
    pathname: "/catalog",
    query: {
      otherfilters: encodeURIComponent(
        JSON.stringify({ deal: "Оренда", category, type })
      ),
    },
  };

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

          {/* Desktop Navigation Links */}
          <ul className={styles.navLinks}>
            <li>
              <Link href={catalogLinkSale}>{t("sale") || "Продаж"}</Link>
            </li>
            <li>
              <Link href={catalogLinkRent} className={styles.navLinks}>
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

        {/* Desktop Right Side */}
        <div className={styles.navRight}>
          <p className={styles.ctaButton} onClick={handleOpenModal}>
            {t("consultation") || "Консультація"}
          </p>
          <div className={styles.contactInfo}>
            <LanguageSwitcher />
            <a href="tel:+380687777337" className={styles.phone}>
              {t("phoneNumber") || "+380 687777337"}
            </a>
          </div>
        </div>

        {/* Mobile Menu Buttons */}
        <div className={styles.mobileMenuToggle}>
          {isMenuOpen ? (
            <button className={styles.closeButton} onClick={toggleMenu}>
              <div className={styles.closeIcon}></div>
            </button>
          ) : (
            <button className={styles.hamburgerButton} onClick={toggleMenu}>
              <div className={styles.hamburgerIcon}></div>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenuWrapper}>
          <ul className={styles.mobileNavLinks}>
            <li>
              <Link href={catalogLinkSale} onClick={toggleMenu}>
                {t("sale") || "Продаж"}
              </Link>
            </li>
            <li>
              <Link href={catalogLinkRent} onClick={toggleMenu}>
                {t("rent") || "Оренда"}
              </Link>
            </li>
            <li>
              <Link href="/team" onClick={toggleMenu}>
                {t("ourTeam") || "Наша команда"}
              </Link>
            </li>
            <li>
              <Link href="/contacts" onClick={toggleMenu}>
                {t("contacts") || "Контакти"}
              </Link>
            </li>
            <li>
              <p className={styles.ctaButton} onClick={handleOpenModal}>
                {t("consultation") || "Консультація"}
              </p>
            </li>
            <li>
              <a
                href="tel:+3801234567"
                className={styles.phone}
                onClick={toggleMenu}
              >
                {t("phoneNumber") || "+3801234567"}
              </a>
            </li>
            <li className={styles.langItem}>
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
