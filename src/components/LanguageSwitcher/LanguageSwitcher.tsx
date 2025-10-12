import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

type Locale = 'uk' | 'en'; 
type DisplayLocale = 'UA' | 'EN';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation('common');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const actualLocale: Locale = i18n.language as Locale;
    
  const currentDisplayLocale: DisplayLocale = 
        actualLocale === 'uk' ? 'UA' : 'EN'; 
    
  const handleLanguageChange = (newLocale: Locale) => {
    i18n.changeLanguage(newLocale);
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.langSelectorContainer}>
      <div
        className={styles.langSelector}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span>{currentDisplayLocale}</span>
        <span className={styles.dropdownArrow}>&#9660;</span>
      </div>
      {isDropdownOpen && (
        <div className={styles.dropdownMenu}>
          {currentDisplayLocale !== 'UA' && (
            <div
              className={styles.dropdownItem}
              onClick={() => handleLanguageChange('uk')} 
            >
              UA 
            </div>
          )}
          {currentDisplayLocale !== 'EN' && (
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
