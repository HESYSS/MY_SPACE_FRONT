import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './privacy-policy.module.css';

const PolicyPage = () => {
  const { t } = useTranslation('common');

  return (
    <div className={styles.privacyPolicyContainer}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.line}></div>
          <h1 className={styles.title}>{t('title')}</h1>
        </div>

        <section className={styles.section}>
          <p className={styles.text}>
            {t('introText')}
          </p>
          <p className={styles.text}>
            {t('changePolicyText')}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('dataCollectionTitle')}</h2>
          <p className={styles.text}>{t('dataCollectionIntro')}</p>
          <ul className={styles.list}>
            <li>{t('ipAddress')}</li>
            <li>{t('contactInfo')}</li>
            <li>{t('otherInfo')}</li>
            <li>{t('onlineBehaviorProfile')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('whyCollectDataTitle')}</h2>
          <p className={styles.text}>{t('whyCollectDataIntro')}</p>
          <ul className={styles.list}>
            <li>{t('understandNeeds')}</li>
            <li>{t('improveServices')}</li>
            <li>{t('sendPromotionalEmails')}</li>
            <li>{t('contactForResearch')}</li>
            <li>{t('customizeWebsite')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('dataSecurityTitle')}</h2>
          <p className={styles.text}>
            {t('dataSecurityText')}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('cookiePolicyTitle')}</h2>
          <p className={styles.text}>{t('cookiePolicyIntro')}</p>
          <p className={styles.text}>{t('cookieDataUsage')}</p>
          <p className={styles.text}>{t('cookieControl')}</p>
          <p className={styles.text}>
            {t('cookieDisableInfo')}
            <a href="https://www.internetcookies.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
              https://www.internetcookies.com
            </a>
            {t('cookieDisableInfo2')}
          </p>
        </section>
        
        <section className={styles.section}>
          <p className={styles.text}>
            {t('dataDistributionPolicy')}
          </p>
        </section>
      </div>
    </div>
  );
};

export default PolicyPage;