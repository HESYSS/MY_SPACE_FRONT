import { useState, useEffect } from 'react';
import styles from './principles.module.css';
import starIcon from '../../../public/icons/star.svg';
import { useTranslation } from 'react-i18next';

export default function OurValues() {
  const { t } = useTranslation('common');
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const response = await fetch('http://localhost:3001/images/Home.svg');
        
        if (!response.ok) {
          throw new Error('Image not found or server error.');
        }

        const data = await response.json();
        
        setImageUrl(data.url);
      } catch (error) {
        console.error("Ошибка при получении URL изображения:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImageUrl();
  }, []);

  return (
    <section className={styles.advantages}>
      <div className={styles.frame142}>
        <div className={styles.info}>
          <div className={styles.frame63}>
            <span className={styles.pretitle}>{t('principlesPretitle')}</span>
            <h2 className={styles.title}>{t('principlesTitle')}</h2>
          </div>
          <div className={styles.aboutUsExamples}>
            <div className={styles.frame394}>
              <div className={styles.frame60}>
                <img src={starIcon.src} alt={t('starAlt')} className={styles.starIcon}/>
                <h3 className={styles.benefitTitle}>{t('broadSelectionTitle')}</h3>
                <p className={styles.benefitText}>
                  {t('broadSelectionText')}
                </p>
              </div>
              <div className={styles.frame59}>
                <img src={starIcon.src} alt={t('starAlt')} className={styles.starIcon}/>
                <h3 className={styles.benefitTitle}>{t('customerTrustTitle')}</h3>
                <p className={styles.benefitText}>
                  {t('customerTrustText')}
                </p>
              </div>
              <div className={styles.frame62}>
                <img src={starIcon.src} alt={t('starAlt')} className={styles.starIcon}/>
                <h3 className={styles.benefitTitle}>{t('reliabilityTitle')}</h3>
                <p className={styles.benefitText}>
                  {t('reliabilityText')}
                </p>
              </div>
            </div>
            <div className={styles.frame395}>
              <div className={styles.frame61}>
                <img src={starIcon.src} alt={t('starAlt')} className={styles.starIcon}/>
                <h3 className={styles.benefitTitle}>{t('easeOfUseTitle')}</h3>
                <p className={styles.benefitText}>
                  {t('easeOfUseText')}
                </p>
              </div>
              <div className={styles.frame55}>
                <img src={starIcon.src} alt={t('starAlt')} className={styles.starIcon}/>
                <h3 className={styles.benefitTitle}>{t('individualApproachTitle')}</h3>
                <p className={styles.benefitText}>
                  {t('individualApproachText')}
                </p>
              </div>
              <div className={styles.frame57}>
                <img src={starIcon.src} alt={t('starAlt')} className={styles.starIcon}/>
                <h3 className={styles.benefitTitle}>{t('secureDealsTitle')}</h3>
                <p className={styles.benefitText}>
                  {t('secureDealsText')}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Используем inline-стиль для фонового изображения */}
        <div 
          className={`${styles.photo} ${isLoading ? styles.loading : ''}`}
          style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}
        >
        </div>
      </div>
    </section>
  );
}