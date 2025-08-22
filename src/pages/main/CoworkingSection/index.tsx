import styles from './CoworkingSection.module.css';
import arrowRight from '../../../../public/icons/line.svg';
import { useTranslation } from 'react-i18next'; // Импортируем хук

export default function CoworkingSection() {
  const { t } = useTranslation('common'); // Используем файл common.json

  return (
    <div className={styles.coworkingP}>
      <div className={styles.coworkingTitle}>
        <div className={styles.line8}></div>
        <h2 className={styles.mainTitle}>{t('cooperationTitle')}</h2>
      </div>
      <div className={styles.coworking}>
        <h3 className={styles.callToAction}>{t('consultationCallToAction')}</h3>
        <div className={styles.frame89}>
          <div className={styles.frame88}>
            <div className={styles.optionRow}>
              <div className={styles.frame87}>
                <div className={styles.line16}></div>
                <div className={styles.frame86}>
                  <p className={styles.optionText}>{t('forSellersLandlords')}</p>
                  <img src={arrowRight.src} alt={t('arrowRightAlt')} className={styles.arrowIcon} />
                </div>
              </div>
            </div>
            <div className={styles.optionRow}>
              <div className={styles.frame85}>
                <div className={styles.line17}></div>
                <div className={styles.frame84}>
                  <p className={styles.optionText}>{t('forBuyersTenants')}</p>
                  <img src={arrowRight.src} alt={t('arrowRightAlt')} className={styles.arrowIcon} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}