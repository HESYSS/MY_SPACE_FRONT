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
  isLarge?: boolean;
}

export default function TeamMemberCard({
  photoSrc,
  name,
  position,
  id,
  isLarge = false,
}: TeamMemberCardProps) {
  const nameWords = name.split(" ");

  const cardClassName = `${styles.teamMemberCard} ${
    isLarge ? styles.partnerCardLarge : ""
  }`;

  return (
    <Link href={`/worker/${id}`} className={cardClassName}>
      <div className={styles.cardContent}>
        {/* БЛОК ФОТО + ИМЯ */}
        <div className={styles.photoAndName}>
          <Image
            src={photoSrc}
            alt={name}
            fill
            className={styles.memberPhoto}
            unoptimized
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

        {/* НИЖНЯЯ ЧАСТЬ */}
        <div className={styles.memberDesc}>
          <div className={styles.memberPosition}>
            <div className={styles.line}></div>
            <p className={styles.positionText}>{position}</p>
          </div>

          <div className={styles.vectors}>
            <Image
              src={mySpaceLogo}
              alt="MySpace Logo"
              width={52}
              height={20}
              className={styles.mySpaceLogo}
            />

            <Image
              src={arrowIcon}
              alt="Arrow"
              width={20}
              height={20}
              className={styles.arrowIcon}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
