import React from "react";
import styles from "./TeamSection.module.css";
import arrowIcon from "../../../../public/icons/vector-9.svg";
import mySpaceLogo from "../../../../public/icons/MySpace_LOGO_5.svg";
import Image from "next/image";
import Link from "next/link";

interface TeamMemberCardProps {
  photoSrc: string;
  name: string;
  position: string;
  id: number;
  isLarge?: boolean; // ДОБАВЛЕНО: Новый пропс
}

export default function TeamMemberCard({
  photoSrc,
  name,
  position,
  id,
  isLarge = false, // ДОБАВЛЕНО: Значение по умолчанию
}: TeamMemberCardProps) {
  const nameWords = name.split(" ");

  // ДОБАВЛЕНО: Условное применение класса для большой карточки
  const cardClassName = `${styles.teamMemberCard} ${
    isLarge ? styles.partnerCardLarge : ""
  }`;

  return (
    <div className={cardClassName}>
      {" "}
      {/* ИСПОЛЬЗУЕТСЯ УСЛОВНЫЙ КЛАСС */}
      <div className={styles.cardContent}>
        <div className={styles.photoAndName}>
          <Image
            src={photoSrc}
            alt={name}
            width={150}
            height={150}
            className={styles.memberPhoto}
          />
          <h3 className={styles.memberName}>
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
            <Image
              src={mySpaceLogo}
              alt="MySpace Logo"
              width={30}
              height={30}
              className={styles.mySpaceLogo}
            />
            <Link href={`/worker/${id}`}>
              <Image
                src={arrowIcon}
                alt="Arrow"
                width={24}
                height={24}
                className={styles.arrowIcon}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
