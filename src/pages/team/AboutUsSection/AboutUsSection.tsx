import styles from './AboutUsSection.module.css';
import teamAbout from '../../../../public/icons/teamAbout.png';
import { useTranslation } from 'react-i18next';

export default function AboutUsSection() {
  const { t } = useTranslation('common');

  return (
    <div className={styles.aboutUs}>
      <div className={styles.titleSection}>
        <h2 className={styles.mainTitle}>{t('aboutUsTitle')}</h2>
        <div className={styles.line8}></div>
      </div>
      <div className={styles.contentSection}>
        <div className={styles.imageContainer}>
          <img
            src={teamAbout.src}
            alt={t('teamImageAlt')}
            className={styles.mainImage}
          />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.frame272}>
            <p className={styles.textHeading}>
              {t('aboutUsMission')}
            </p>
            <p className={styles.textBody}>
              {t('aboutUsTextBody')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}