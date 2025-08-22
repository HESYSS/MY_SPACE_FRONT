import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

// Определяем тип для языков, чтобы избежать 'any'
type Locale = 'ua' | 'en';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation('common');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Явно указываем, что newLocale имеет тип Locale
  const handleLanguageChange = (newLocale: Locale) => {
    i18n.changeLanguage(newLocale);
    setIsDropdownOpen(false);
  };

  const currentLocale = i18n.language.toUpperCase();

  return (
    <div className={styles.langSelectorContainer}>
      <div
        className={styles.langSelector}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span>{currentLocale}</span>
        <span className={styles.dropdownArrow}>&#9660;</span>
      </div>
      {isDropdownOpen && (
        <div className={styles.dropdownMenu}>
          {currentLocale !== 'UA' && (
            <div
              className={styles.dropdownItem}
              onClick={() => handleLanguageChange('ua')}
            >
              UA
            </div>
          )}
          {currentLocale !== 'EN' && (
            <div
              className={styles.dropdownItem}
              onClick={() => handleLanguageChange('en')}
            >
              EN
            </div>
          )}
        </div>
      )}
    </div>
  );
}