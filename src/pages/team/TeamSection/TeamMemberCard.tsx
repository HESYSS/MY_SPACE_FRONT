import React from 'react';
import styles from './TeamSection.module.css';
import arrowIcon from '../../../../public/icons/vector-9.svg';
import mySpaceLogo from '../../../../public/icons/MySpace_LOGO_5.svg';
import { Link } from 'react-router-dom';

interface TeamMemberCardProps {
  photoSrc: string;
  name: string;
  position: string;
  id: number; // Добавили id работника
}

export default function TeamMemberCard({ photoSrc, name, position, id }: TeamMemberCardProps) {

  const nameWords = name.split(' ');

  return (
    <div className={styles.teamMemberCard}>
      <div className={styles.cardContent}>
        <div className={styles.photoAndName}>
          {/* Путь к изображению напрямую из props */}
          <img src={photoSrc} alt={name} className={styles.memberPhoto} />
          <h3 className={styles.memberName}>
            {/* Проходим по массиву слов и вставляем <br /> после каждого слова, кроме последнего */}
            {nameWords.map((word, index) => (
              <span key={index}>
                {word}
                {index < nameWords.length - 1 && <br />}
              </span>
            ))}
          </h3>
        </div>
        <div className={styles.memberDesc}>
          <div className={styles.memberPosition}>
            <div className={styles.line}></div>
            <p className={styles.positionText}>{position}</p>
          </div>
          <div className={styles.vectors}>
            {/* Используем импортированные SVG */}
            <img src={mySpaceLogo.src} alt="MySpace Logo" className={styles.mySpaceLogo} />
            {/* Используем динамический URL для перехода на страницу с полными данными */}
            <Link to={`/worker/${id}`}>
              <img src={arrowIcon.src} alt="Arrow" className={styles.arrowIcon} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
