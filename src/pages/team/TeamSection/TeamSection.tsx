// src/components/TeamSection/TeamSection.js
import { useState, useEffect } from 'react';
import styles from './TeamSection.module.css';
import TeamMemberCard from './TeamMemberCard';
import { useTranslation } from 'react-i18next';

// Импорт изображений членов команды (пока что один для всех)
import defaultTeamImage from '../../../../public/icons/vitaliyPenc.png';

// Интерфейс для данных, получаемых с бэкенда
interface Employee {
  id: number;
  firstName: string; // Используется для украинского имени
  lastName: string;  // Используется для украинской фамилии
  position: string;  // Используется для украинской должности
  firstNameEn?: string; // Используется для английского имени
  lastNameEn?: string;  // Используется для английской фамилии
  positionEn?: string;  // Используется для английской должности
  isPARTNER: boolean;
  isMANAGER: boolean;
  isACTIVE: boolean;
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

  // Разделение партнеров на две колонки
  const partnersMidpoint = Math.ceil(partners.length / 2);
  const partnersCol1 = partners.slice(0, partnersMidpoint);
  const partnersCol2 = partners.slice(partnersMidpoint);

  // Разделение менеджеров на две колонки
  const managersMidpoint = Math.ceil(managers.length / 2);
  const managersCol1 = managers.slice(0, managersMidpoint);
  const managersCol2 = managers.slice(managersMidpoint);

  return (
    <div className={styles.teamSection}>
      <div className={styles.titles}>
        <h2 className={styles.title}>{t('partnersTitle')}</h2>
        <h2 className={styles.title}>{t('managersTitle')}</h2>
      </div>
      <div className={styles.teamMembersContainer}>
        {/* Первая колонка для партнеров */}
        <div className={styles.teamColumn}>
          {partnersCol1.map((member) => {
            const { name, position } = getMemberData(member, i18n.language);
            return (
              <TeamMemberCard
                key={member.id}
                name={name}
                position={position}
                photoSrc={defaultTeamImage.src}
              />
            );
          })}
        </div>
        {/* Вторая колонка для партнеров */}
        <div className={styles.teamColumn}>
          {partnersCol2.map((member) => {
            const { name, position } = getMemberData(member, i18n.language);
            return (
              <TeamMemberCard
                key={member.id}
                name={name}
                position={position}
                photoSrc={defaultTeamImage.src}
              />
            );
          })}
        </div>
        {/* Третья колонка для менеджеров */}
        <div className={styles.teamColumn}>
          {managersCol1.map((member) => {
            const { name, position } = getMemberData(member, i18n.language);
            return (
              <TeamMemberCard
                key={member.id}
                name={name}
                position={position}
                photoSrc={defaultTeamImage.src}
              />
            );
          })}
        </div>
        {/* Четвертая колонка для менеджеров */}
        <div className={styles.teamColumn}>
          {managersCol2.map((member) => {
            const { name, position } = getMemberData(member, i18n.language);
            return (
              <TeamMemberCard
                key={member.id}
                name={name}
                position={position}
                photoSrc={defaultTeamImage.src}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}