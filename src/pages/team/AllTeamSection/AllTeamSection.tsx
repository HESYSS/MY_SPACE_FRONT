import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./AllTeamSection.module.css";
import { useTranslation } from "react-i18next";
import Link from "next/link";
// Убираем импорт локального изображения, если не хотим использовать его как заглушку.
// Если хотим, оставляем. В этом примере я его оставил, чтобы была запасная опция.
import vitaliyPenc from "../../../../public/icons/vitaliyPenc.png"; 

// ОБНОВЛЕННЫЙ ИНТЕРФЕЙС Employee
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
  photoUrl?: string; // <-- ДОБАВЛЕНО ПОЛЕ
}

const AllTeamSection: React.FC = () => {
  const { t, i18n } = useTranslation("common");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769 && window.innerWidth <= 1300) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(5);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3001/employee");
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data: Employee[] = await response.json();
        setEmployees(data);
      } catch (err) {
        console.error("Ошибка при получении данных:", err);
        setError("Не удалось загрузить список команды.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const getEmployeeData = (employee: Employee, language: string) => {
    const isEnglish = language === "en";
    return {
      name:
        isEnglish && employee.firstNameEn && employee.lastNameEn
          ? `${employee.firstNameEn} ${employee.lastNameEn}`
          : `${employee.firstName} ${employee.lastName}`,
      role:
        isEnglish && employee.positionEn
          ? employee.positionEn
          : employee.position,
    };
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className={styles.allTeamContainer}>
      <h2 className={styles.sectionTitle}>{t("allTeamTitle")}</h2>
      <div className={styles.carouselContainer}>
        <div
          className={styles.teamRow}
          style={{ 
            transform: `translateX(-${(currentPage - 1) * 100}%)`,
            '--items-per-page': itemsPerPage,
            '--gap': '30px', // Отступ для ПК
            '--tablet-gap': '15px' // Отступ для планшета
          } as React.CSSProperties}
        >
          {employees.length === 0 ? (
            <p>Список сотрудников пуст.</p>
          ) : (
            employees.map((member) => {
              const { name, role } = getEmployeeData(member, i18n.language);
              
              // ОПРЕДЕЛЯЕМ ИСТОЧНИК ИЗОБРАЖЕНИЯ:
              // Если есть photoUrl, используем его, иначе - заглушку.
              const imageUrl = member.photoUrl || vitaliyPenc.src;

              return (
                <div key={member.id} className={styles.teamMemberCard}>
                  <div className={styles.cardContent}>
                    <div className={styles.photoAndName}>
                      <Image
                        src={imageUrl} // <-- ИСПОЛЬЗУЕМ ДИНАМИЧЕСКИЙ URL
                        alt={name}
                        className={styles.memberPhoto}
                        fill
                      />
                      <div className={styles.gradientOverlay}></div>
                      <div className={styles.textContainer}>
                        <Link
                          href={`/worker/${member.id}`}
                          className={styles.memberName}
                        >
                          {name}
                        </Link>
                        <p className={styles.memberRole}>{role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
              <div
                key={index}
                className={
                  index + 1 === currentPage ? styles.dotActive : styles.dot
                }
                onClick={() => handlePageChange(index + 1)}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTeamSection;