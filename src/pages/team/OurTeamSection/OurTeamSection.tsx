import React from 'react';
import Image from 'next/image';
import styles from './OurTeamSection.module.css';
import arrow from '../../../../public/icons/Vector10.svg'

// Импортируем все изображения
import irinaBubenko from '../../../../public/icons/Бубенко_Ірина.png';

// Данные о членах команды, разделенные по колонкам
const teamMembersColumns = [
  // Column 1
  [
    { name: 'Ірина Бубенко', role: 'провідний експерт з нерухомості', image: irinaBubenko },
    { name: 'Ігор Глоба', role: 'експерт з нерухомості', image: irinaBubenko },
  ],
  // Column 2
  [
    { name: 'Людмила Ларшина', role: 'провідний експерт з нерухомості', image: irinaBubenko },
    { name: 'Юлія Саєнко', role: 'експерт з нерухомості', image: irinaBubenko },
  ],
  // Column 3
  [
    { name: 'Марина Павліченко', role: 'Провідний експерт з нерухомості', image: irinaBubenko },
    { name: 'Олена Калантарян', role: 'експерт з нерухомості', image: irinaBubenko },
  ],
  // Column 4
  [
    { name: 'Олена Ринка', role: 'експерт з нерухомості', image: irinaBubenko },
    { name: 'Ірина Фальківська', role: 'експерт з нерухомості', image: irinaBubenko },
  ],
];

const OurTeamSection = () => {
  return (
    <div className={styles.container}>
      {/* Title section */}
      <div className={styles.titleSection}>
        <div className={styles.line}></div>
        <h2 className={styles.mainTitle}>НАША КОМАНДА</h2>
      </div>
      
      {/* Active team section */}
      <div className={styles.activeTeam}>
        <h3 className={styles.activeTeamTitle}>Найактивніші члени команди по продажам</h3>
        
        {/* Container for the member columns */}
        <div className={styles.bestMembers}>
          {teamMembersColumns.map((column, columnIndex) => (
            <div key={columnIndex} className={`${styles.column} ${styles['column' + (columnIndex + 1)]}`}>
              {column.map((member, cardIndex) => (
                <div className={styles.memberCard} key={cardIndex}>
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={member.image}
                      alt={member.name} 
                      className={styles.memberImage} 
                    />
                    <div className={styles.imageOverlay}></div>
                  </div>
                  <div className={styles.memberInfo}>
                    <h4 className={styles.memberName}>{member.name}</h4>
                    <div className={styles.memberRole}>
                      {/* Стрелка теперь слева */}
                      <Image 
                        src={arrow}
                        alt="Arrow"
                        className={styles.arrow}
                      />
                      <p className={styles.roleText}>{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurTeamSection;