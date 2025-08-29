import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./AllTeamSection.module.css";
import { useTranslation } from "react-i18next";
import Link from "next/link";

import vitaliyPenc from "../../../../public/icons/vitaliyPenc.png";

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
}

const ITEMS_PER_PAGE = 5;

const AllTeamSection: React.FC = () => {
  const { t, i18n } = useTranslation("common");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(employees.length / ITEMS_PER_PAGE);

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
          style={{ transform: `translateX(-${(currentPage - 1) * 100}%)` }}
        >
          {employees.length === 0 ? (
            <p>Список сотрудников пуст.</p>
          ) : (
            employees.map((member) => {
              const { name, role } = getEmployeeData(member, i18n.language);
              return (
                <div key={member.id} className={styles.teamMemberCard}>
                  <div className={styles.cardContent}>
                    <div className={styles.photoAndName}>
                      <Image
                        src={vitaliyPenc}
                        alt={name}
                        className={styles.memberPhoto}
                      />
                      <div className={styles.gradientOverlay}></div>
                      <div className={styles.textContainer}>
                        {/* Динамическая ссылка на страницу сотрудника */}
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
