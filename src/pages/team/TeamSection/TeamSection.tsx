// src/components/TeamSection/TeamSection.js

import styles from './TeamSection.module.css';
import TeamMemberCard from './TeamMemberCard';
import { useTranslation } from 'react-i18next'; // Импортируем хук

// Импорт изображений членов команды
import vitaliyPenc from '../../../../public/icons/vitaliyPenc.png';

export default function TeamSection() {
  const { t } = useTranslation('common');

  // Данные о членах команды остаются без изменений, так как они не переводятся через useTranslation
  const partners = [
    {
      name: 'ВІТАЛІЙ ПЕНЦ',
      position: 'КЕРУЮЧИЙ ПАРТНЕР',
      photoSrc: vitaliyPenc.src,
    },
    {
      name: 'ЮЛІЯ ОЛІЙНИК',
      position: 'ЕКСПЕРТ ПО ОЦІНЦІ ВЛАСНОСТІ',
      photoSrc: vitaliyPenc.src,
    },
    {
      name: 'ОЛЕКСАНДР НОВАК',
      position: 'ПАРТНЕР',
      photoSrc: vitaliyPenc.src,
    },
    {
      name: 'АНДРІЙ ПОЛІЩУК',
      position: 'ПАРТНЕР',
      photoSrc: vitaliyPenc.src,
    },
  ];

  const managers = [
    {
      name: 'ВАДИМ ШЕВЧЕНКО',
      position: 'ПАРТНЕР, ЕКСПЕРТ З НЕРУХОМОСТІ',
      photoSrc: vitaliyPenc.src,
    },
    {
      name: 'ОЛЕНА МЕЛЬНИК',
      position: 'МЕНЕДЖЕР ПРОЕКТІВ',
      photoSrc: vitaliyPenc.src,
    },
    {
      name: 'СЕРГІЙ КОВАЛЕНКО',
      position: 'МЕНЕДЖЕР З ПРОДАЖУ',
      photoSrc: vitaliyPenc.src,
    },
    {
      name: 'НАТАЛІЯ ДЕНИСЕНКО',
      position: 'ФІНАНСОВИЙ АНАЛІТИК',
      photoSrc: vitaliyPenc.src,
    },
  ];

  return (
    <div className={styles.teamSection}>
      <div className={styles.titles}>
        <h2 className={styles.title}>{t('partnersTitle')}</h2>
        <h2 className={styles.title}>{t('managersTitle')}</h2>
      </div>
      <div className={styles.teamMembersContainer}>
        {/* Row 1 - Partners */}
        <div className={styles.row}>
          {partners.map((member, index) => (
            <TeamMemberCard
              key={index}
              name={member.name}
              position={member.position}
              photoSrc={member.photoSrc}
            />
          ))}
        </div>
        {/* Row 2 - Managers */}
        <div className={styles.row}>
          {managers.map((member, index) => (
            <TeamMemberCard
              key={index}
              name={member.name}
              position={member.position}
              photoSrc={member.photoSrc}
            />
          ))}
        </div>
      </div>
    </div>
  );
}