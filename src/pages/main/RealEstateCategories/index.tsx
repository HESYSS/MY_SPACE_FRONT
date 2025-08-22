// components/RealEstateCategories/RealEstateCategories.jsx

import styles from './RealEstateCategories.module.css';
import { useTranslation } from 'react-i18next';

export default function RealEstateCategories() {
  const { t } = useTranslation('common');

  return (
    <div className={styles.realEstateP}>
      <div className={styles.titleRealEstate}>
        <div className={styles.line8}></div>
        <h2 className={styles.mainTitle}>{t('allRealEstateTitle')}</h2>
      </div>
      <div className={styles.columnsRealEstate}>
        <div className={styles.column1}>
          <div className={styles.frame48}>
            <p className={styles.textBlock}>{t('bestOffers')}</p>
          </div>
          <a href="#" className={styles.frame49}>
          </a>
        </div>
        <div className={styles.frame369}>
          <a href="#" className={styles.column2}>
          </a>
        </div>
        <div className={styles.column3}>
          <a href="#" className={styles.frame43}>
          </a>
          <div className={styles.frame47}>
            <p className={styles.textBlock}>{t('largeSelection')}</p>
          </div>
        </div>
        <div className={styles.column4}>
          <a href="#" className={styles.frame43}>
          </a>
        </div>
      </div>
    </div>
  );
}