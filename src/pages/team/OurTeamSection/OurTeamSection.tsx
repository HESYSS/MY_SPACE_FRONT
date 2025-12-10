import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./OurTeamSection.module.css";
import arrow from "../../../../public/icons/Vector10.svg";
import { useTranslation } from "react-i18next";
import Link from "next/link"; // Обязательный импорт

import defaultTeamImage from "../../../../public/icons/Бубенко_Ірина.png";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  firstNameEn?: string;
  lastNameEn?: string;
  positionEn?: string;
  isACTIVE: boolean;
  photoUrl?: string;
}

const OurTeamSection = () => {
  const { t, i18n } = useTranslation("common");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Убедитесь, что эта переменная окружения доступна и правильно настроена
        const backendUrl = process.env.REACT_APP_API_URL; 

        // Проверка на undefined или null
        if (!backendUrl) {
            throw new Error("REACT_APP_API_URL is not defined in environment.");
        }

        const response = await fetch(`${backendUrl}/employee`);
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data: Employee[] = await response.json();

        // Сортировка по полю isACTIVE, как указано в логике
        const activeEmployees = data.filter((employee) => employee.isACTIVE);
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
        <h2 className={styles.mainTitle}>{t("ourTeamTitle")}</h2>
      </div>

      <div className={styles.activeTeam}>
        <h3 className={styles.activeTeamTitle}>{t("activeTeamTitle")}</h3>

        {employees.length === 0 ? (
          <p className={styles.emptyMessage}>
            Список активных сотрудников пуст.
          </p>
        ) : (
          <div className={styles.teamGrid}>
            {employees.map((member) => {
              const currentLanguage = i18n.language;
              const firstName =
                currentLanguage === "en" && member.firstNameEn
                  ? member.firstNameEn
                  : member.firstName;
              const lastName =
                currentLanguage === "en" && member.lastNameEn
                  ? member.lastNameEn
                  : member.lastName;
              const role =
                currentLanguage === "en" && member.positionEn
                  ? member.positionEn
                  : member.position;

              // Используем photoUrl, если доступен, иначе — дефолтный локальный файл
              const imageUrl = member.photoUrl || defaultTeamImage.src;

              return (
                <div className={styles.memberCard} key={member.id}>
                  {/* ИЗМЕНЕНИЕ: Оборачиваем imageWrapper в Link */}
                  <Link 
                    href={`/worker/${member.id}`} 
                    className={styles.imageLink} // Используем для сброса стилей ссылки
                  >
                    <div className={styles.imageWrapper}>
                      <Image
                        src={imageUrl}
                        alt={`${firstName} ${lastName}`}
                        className={styles.memberImage}
                        fill
                        unoptimized
                      />
                      <div className={styles.imageOverlay}></div>
                    </div>
                  </Link>

                  <div className={styles.memberInfo}>
                    <h4 className={styles.memberName}>
                      {firstName}
                      <br />
                      {lastName}
                    </h4>
                    
                    {/* Ссылка для роли/стрелочки (оставлена, если нужно) */}
                    <Link
                      href={`/worker/${member.id}`}
                      className={styles.memberRole}
                    >
                      <Image src={arrow} alt="Arrow" className={styles.arrow} />
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
