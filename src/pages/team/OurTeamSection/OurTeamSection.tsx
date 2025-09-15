import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './OurTeamSection.module.css';
import arrow from '../../../../public/icons/Vector10.svg'
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

// Пока что используем одно локальное изображение для всех
import defaultTeamImage from '../../../../public/icons/Бубенко_Ірина.png';

// ОБНОВЛЕННЫЙ ИНТЕРФЕЙС Employee
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  firstNameEn?: string;
  lastNameEn?: string;
  positionEn?: string;
  isACTIVE: boolean;
  photoUrl?: string; // <-- ДОБАВЛЕНО ПОЛЕ ДЛЯ URL ФОТОГРАФИИ
}

const OurTeamSection = () => {
  const { t, i18n } = useTranslation('common');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3001/employee");
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data: Employee[] = await response.json();
        
        const activeEmployees = data.filter(employee => employee.isACTIVE);
        setEmployees(activeEmployees);
      } catch (err) {
        console.error("Ошибка при получении данных:", err);
        setError("Не удалось загрузить список команды.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <div className={styles.line}></div>
        <h2 className={styles.mainTitle}>{t('ourTeamTitle')}</h2>
      </div>
      
      <div className={styles.activeTeam}>
        <h3 className={styles.activeTeamTitle}>{t('activeTeamTitle')}</h3>
        
        {employees.length === 0 ? (
          <p className={styles.emptyMessage}>Список активных сотрудников пуст.</p>
        ) : (
          // ЕДИНЫЙ КОНТЕЙНЕР ДЛЯ ВСЕХ КАРТОЧЕК
          <div className={styles.teamGrid}> 
            {employees.map((member) => {
              const currentLanguage = i18n.language;
              const firstName = currentLanguage === 'en' && member.firstNameEn ? member.firstNameEn : member.firstName;
              const lastName = currentLanguage === 'en' && member.lastNameEn ? member.lastNameEn : member.lastName;
              const role = currentLanguage === 'en' && member.positionEn ? member.positionEn : member.position;

              const imageUrl = member.photoUrl || defaultTeamImage.src;

              return (
                <div className={styles.memberCard} key={member.id}>
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={imageUrl}
                      alt={`${firstName} ${lastName}`} 
                      className={styles.memberImage} 
                      fill
                    />
                    <div className={styles.imageOverlay}></div>
                  </div>
                  <div className={styles.memberInfo}>
                    <h4 className={styles.memberName}>
                      {firstName}
                      <br />
                      {lastName}
                    </h4>
                    <Link href={`/worker/${member.id}`} className={styles.memberRole}>
                      <Image 
                        src={arrow}
                        alt="Arrow"
                        className={styles.arrow}
                      />
                      <p className={styles.roleText}>{role}</p>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OurTeamSection;