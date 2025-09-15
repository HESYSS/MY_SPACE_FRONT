// src/components/TeamSection/TeamSection.js

import { useState, useEffect } from 'react';
import styles from './TeamSection.module.css';
import TeamMemberCard from './TeamMemberCard';
import { useTranslation } from 'react-i18next';

// Импорт изображений членов команды (пока что один для всех)
import defaultTeamImage from '../../../../public/icons/vitaliyPenc.png';

// Обновленный интерфейс для данных, получаемых с бэкенда
interface Employee {
  id: number;
  firstName: string; 
  lastName: string;  
  position: string;  
  firstNameEn?: string; 
  lastNameEn?: string;  
  positionEn?: string;  
  isPARTNER: boolean;
  isMANAGER: boolean;
  isACTIVE: boolean;
  photoUrl?: string;
}

export default function TeamSection() {
  const { t, i18n } = useTranslation('common');
  const [partners, setPartners] = useState<Employee[]>([]);
  const [managers, setManagers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch("http://localhost:3001/employee");
        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }
        const data: Employee[] = await response.json();

        const fetchedPartners = data.filter(member => member.isPARTNER);
        const fetchedManagers = data.filter(member => member.isMANAGER);

        setPartners(fetchedPartners);
        setManagers(fetchedManagers);

      } catch (err) {
        console.error("Ошибка при получении данных:", err);
        setError("Не удалось загрузить список команды.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  const getMemberData = (member: Employee, language: string) => {
    const isEnglish = language === 'en';
    return {
      name: isEnglish && member.firstNameEn && member.lastNameEn
        ? `${member.firstNameEn} ${member.lastNameEn}`
        : `${member.firstName} ${member.lastName}`,
      position: isEnglish && member.positionEn ? member.positionEn : member.position,
    };
  };

  return (
    <div className={styles.teamSection}>
      {/* Container for Partners */}
      <div className={styles.groupContainer}>
        <h2 className={styles.title}>{t('partnersTitle')}</h2>
        <div className={styles.teamGroup}>
          {partners.map((member) => {
            const { name, position } = getMemberData(member, i18n.language);
            return (
              <TeamMemberCard
                key={member.id}
                id={member.id}
                name={name}
                position={position}
                photoSrc={member.photoUrl || defaultTeamImage.src}
              />
            );
          })}
        </div>
      </div>
      
      {/* Container for Managers */}
      <div className={styles.groupContainer}>
        <h2 className={styles.title}>{t('managersTitle')}</h2>
        <div className={styles.teamGroup}>
          {managers.map((member) => {
            const { name, position } = getMemberData(member, i18n.language);
            return (
              <TeamMemberCard
                key={member.id}
                id={member.id}
                name={name}
                position={position}
                photoSrc={member.photoUrl || defaultTeamImage.src}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}