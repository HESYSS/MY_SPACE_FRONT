import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

// Определяем тип для языков. 
// Внутренне i18next использует 'uk', но UI должен отображать 'UA'.
type Locale = 'uk' | 'en'; 
type DisplayLocale = 'UA' | 'EN';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation('common');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 1. Фактический текущий язык (uk или en)
  const actualLocale: Locale = i18n.language as Locale;
    
  // 2. Отображаемый язык (UA или EN)
  // Если текущий язык 'uk', отображаем 'UA', иначе - EN.
  const currentDisplayLocale: DisplayLocale = 
        actualLocale === 'uk' ? 'UA' : 'EN'; 
    
  // Функция для переключения языка в i18n
  const handleLanguageChange = (newLocale: Locale) => {
    // i18n будет использовать 'uk' или 'en'
    i18n.changeLanguage(newLocale);
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.langSelectorContainer}>
      <div
        className={styles.langSelector}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {/* Отображаем UA или EN */}
        <span>{currentDisplayLocale}</span>
        <span className={styles.dropdownArrow}>&#9660;</span>
      </div>
      {isDropdownOpen && (
        <div className={styles.dropdownMenu}>
          {/* Если текущий язык не UA, показываем опцию UA */}
          {currentDisplayLocale !== 'UA' && (
            <div
              className={styles.dropdownItem}
              // При клике вызываем i18n.changeLanguage с правильным кодом 'uk'
              onClick={() => handleLanguageChange('uk')} 
            >
              UA 
            </div>
          )}
          {/* Если текущий язык не EN, показываем опцию EN */}
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
