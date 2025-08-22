import React from 'react';
import Image from 'next/image';
import styles from './AllTeamSection.module.css';
import { useTranslation } from 'react-i18next'; // Импортируем хук

// Импортируем изображения
import vitaliyPenc from '../../../../public/icons/vitaliyPenc.png'

const teamMembers = [
  { name: 'Володимир Мірянов', role: 'Експерт з нерухомості', photo: vitaliyPenc },
  { name: 'Ольга Журавська', role: 'Експерт з нерухомості', photo: vitaliyPenc },
  { name: 'Аліна Шумакова', role: 'Експерт з нерухомості', photo: vitaliyPenc },
  { name: 'Лілія Стрельченко', role: 'Експерт з нерухомості', photo: vitaliyPenc },
  { name: 'Павло Кудла', role: 'Експерт з нерухомості', photo: vitaliyPenc },
];

const AllTeamSection = () => {
  const { t } = useTranslation('common');

  return (
    <div className={styles.allTeamContainer}>
      <h2 className={styles.sectionTitle}>{t('allTeamTitle')}</h2>
      <div className={styles.carouselContainer}>
        <div className={styles.teamRow}>
          {teamMembers.map((member, index) => (
            <div key={index} className={styles.teamMemberCard}>
              <div className={styles.cardContent}>
                <div className={styles.photoAndName}>
                  <Image
                    src={member.photo}
                    alt={member.name}
                    className={styles.memberPhoto}
                  />
                  <div className={styles.gradientOverlay}></div>
                  <div className={styles.textContainer}>
                    <p className={styles.memberName}>{member.name}</p>
                    <p className={styles.memberRole}>{member.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.pagination}>
          <div className={styles.dotActive}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      </div>
    </div>
  );
};

export default AllTeamSection;