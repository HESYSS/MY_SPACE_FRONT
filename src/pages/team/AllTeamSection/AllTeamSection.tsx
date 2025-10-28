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
  isSUPERVISOR: boolean;
  photoUrl?: string;
}

const AllTeamSection: React.FC = () => {
  const { t, i18n } = useTranslation("common");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // 👉 состояния для свайпа / драга
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [dragX, setDragX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // адаптация под ширину экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(2);
      } else if (window.innerWidth > 768 && window.innerWidth <= 1300) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(5);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // загрузка сотрудников
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const backendUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${backendUrl}/employee`);
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

  const activeEmployees = employees.filter((member) => !member.isSUPERVISOR);
  const totalPages = Math.ceil(activeEmployees.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

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

  // --- Универсальная логика свайпа и мыши ---
  const startDrag = (clientX: number) => {
    setTouchStartX(clientX);
    setIsDragging(true);
  };

  const moveDrag = (clientX: number) => {
    if (!isDragging || touchStartX === null) return;
    const dragDistance = clientX - touchStartX;
    setDragX(dragDistance);
  };

  const endDrag = () => {
    if (touchStartX === null) return;
    const swipeThreshold = 50;
    if (dragX < -swipeThreshold) {
      handlePageChange(currentPage + 1);
    } else if (dragX > swipeThreshold) {
      handlePageChange(currentPage - 1);
    }
    setIsDragging(false);
    setTouchStartX(null);
    setDragX(0);
  };

  // touch события
  const handleTouchStart = (e: React.TouchEvent) =>
    startDrag(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) =>
    moveDrag(e.touches[0].clientX);
  const handleTouchEnd = () => endDrag();

  // mouse события
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // чтобы не выделялся текст и не тянулись ссылки
    startDrag(e.clientX);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) moveDrag(e.clientX);
  };
  const handleMouseUp = () => endDrag();
  const handleMouseLeave = () => {
    if (isDragging) endDrag();
  };

  const isMobileOrTablet = itemsPerPage === 2 || itemsPerPage === 4;

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className={styles.allTeamContainer}>
      <h2 className={styles.sectionTitle}>{t("allTeamTitle")}</h2>
      <div className={styles.carouselContainer}>
        <div
          className={styles.teamRow}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={
            {
              transform: `translateX(calc(-${
                (currentPage - 1) * 100
              }% + ${dragX}px))`,
              transition: isDragging ? "none" : "transform 0.5s ease-in-out",
              "--items-per-page": itemsPerPage,
              "--gap": itemsPerPage === 5 ? "30px" : "15px",
              cursor: isDragging ? "grabbing" : "grab",
            } as React.CSSProperties
          }
        >
          {activeEmployees.length === 0 ? (
            <p>Список сотрудников пуст.</p>
          ) : (
            activeEmployees.map((member) => {
              const { name, role } = getEmployeeData(member, i18n.language);
              const imageUrl = member.photoUrl || vitaliyPenc.src;
              if (member.isSUPERVISOR === true) return null;
              return (
                <div key={member.id} className={styles.teamMemberCard}>
                  <div className={styles.cardContent}>
                    <div className={styles.photoAndName}>
                      <Image
                        src={imageUrl}
                        alt={name}
                        className={styles.memberPhoto}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
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
