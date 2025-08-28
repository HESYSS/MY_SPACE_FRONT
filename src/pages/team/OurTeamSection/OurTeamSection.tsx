// OurTeamSection.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './OurTeamSection.module.css';
import arrow from '../../../../public/icons/Vector10.svg'
import { useTranslation } from 'react-i18next';
import Link from 'next/link'; // Импортируем компонент Link

// Пока что используем одно локальное изображение для всех
import defaultTeamImage from '../../../../public/icons/Бубенко_Ірина.png';

// Интерфейс для данных, получаемых с бэкенда
interface Employee {
  id: number;
  firstName: string; // Используется для украинского имени
  lastName: string;  // Используется для украинской фамилии
  position: string;  // Используется для украинской должности
  firstNameEn?: string; // Используется для английского имени
  lastNameEn?: string;  // Используется для английской фамилии
  positionEn?: string;  // Используется для английской должности
  // Добавляем булево поле для фильтрации
  isACTIVE: boolean;
}

const OurTeamSection = () => {
  const { t, i18n } = useTranslation('common');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных с бэкенда при монтировании компонента
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3001/employee");
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data: Employee[] = await response.json();
        
        // Фильтруем список, чтобы отображать только активных сотрудников
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

  // Функция для распределения работников по 4 колонкам
  const getColumns = (members: Employee[]) => {
    const columns: Employee[][] = [[], [], [], []];
    members.forEach((member, index) => {
      columns[index % 4].push(member);
    });
    return columns;
  };

  const teamMembersColumns = getColumns(employees);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.container}>
      {/* Title section */}
      <div className={styles.titleSection}>
        <div className={styles.line}></div>
        <h2 className={styles.mainTitle}>{t('ourTeamTitle')}</h2>
      </div>
      
      {/* Active team section */}
      <div className={styles.activeTeam}>
        <h3 className={styles.activeTeamTitle}>{t('activeTeamTitle')}</h3>
        
        {/* Container for the member columns */}
        {employees.length === 0 ? (
          <p className={styles.emptyMessage}>Список активных сотрудников пуст.</p>
        ) : (
          <div className={styles.bestMembers}>
            {teamMembersColumns.map((column, columnIndex) => (
              <div key={columnIndex} className={`${styles.column} ${styles['column' + (columnIndex + 1)]}`}>
                {column.map((member) => {
                  // Выбираем данные в зависимости от текущего языка
                  const currentLanguage = i18n.language;
                  const firstName = currentLanguage === 'en' && member.firstNameEn
                    ? member.firstNameEn
                    : member.firstName;
                  
                  const lastName = currentLanguage === 'en' && member.lastNameEn
                    ? member.lastNameEn
                    : member.lastName;
                  
                  const role = currentLanguage === 'en' && member.positionEn
                    ? member.positionEn
                    : member.position;

                  return (
                    <div className={styles.memberCard} key={member.id}>
                      <div className={styles.imageWrapper}>
                        <Image 
                          src={defaultTeamImage}
                          alt={`${firstName} ${lastName}`} 
                          className={styles.memberImage} 
                        />
                        <div className={styles.imageOverlay}></div>
                      </div>
                      <div className={styles.memberInfo}>
                        <h4 className={styles.memberName}>
                          {firstName}
                          <br />
                          {lastName}
                        </h4>
                        {/* Оборачиваем роль и стрелку в компонент Link */}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OurTeamSection;
