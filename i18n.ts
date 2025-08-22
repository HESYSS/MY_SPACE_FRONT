import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ua',
    debug: true,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    backend: {
      // Здесь указываем путь, где хранятся наши файлы переводов
      // public/locales/{{lng}}/{{ns}}.json
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: false // Отключаем Suspense для простоты
    }
  });

export default i18n;