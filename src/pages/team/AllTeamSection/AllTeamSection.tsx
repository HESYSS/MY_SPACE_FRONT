import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./AllTeamSection.module.css";
import { useTranslation } from "react-i18next";
import Link from "next/link"; // Оставляем импорт
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
  // НОВОЕ СОСТОЯНИЕ: отслеживает, был ли "свайп" (перемещение), а не просто клик
  const [isSwiped, setIsSwiped] = useState<boolean>(false); 

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

  const activeEmployees = employees.filter((member) => !member.isSUPERVISOR && member.isPARTNER === false );
  const totalPages = Math.ceil(activeEmployees.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePrev = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNext = () => {
    handlePageChange(currentPage + 1);
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
    // Сбрасываем флаг свайпа перед началом
    setIsSwiped(false); 
  };

  const moveDrag = (clientX: number) => {
    if (!isDragging || touchStartX === null) return;
    const dragDistance = clientX - touchStartX;
    setDragX(dragDistance);
    // Если перемещение больше небольшого порога, считаем это свайпом
    if (Math.abs(dragDistance) > 10) { 
      setIsSwiped(true);
    }
  };

  const endDrag = () => {
    if (touchStartX === null) return;
    const swipeThreshold = 50;
    // Если расстояние перетаскивания превышает порог, меняем страницу
    if (dragX < -swipeThreshold) {
      handlePageChange(currentPage + 1);
      setIsSwiped(true); // Убеждаемся, что переход по ссылке не произойдет
    } else if (dragX > swipeThreshold) {
      handlePageChange(currentPage - 1);
      setIsSwiped(true); // Убеждаемся, что переход по ссылке не произойдет
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
    // ВАЖНО: только для элементов, которые не являются ссылками,
    // чтобы позволить ссылкам внутри себя работать как обычно, 
    // но в вашем случае вся карточка будет ссылкой, поэтому оставляем.
    e.preventDefault(); 
    startDrag(e.clientX);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) moveDrag(e.clientX);
  };
  const handleMouseUp = () => endDrag();
  const handleMouseLeave = () => {
    if (isDragging) endDrag();
  };
  
  // НОВАЯ ФУНКЦИЯ: предотвращает переход по ссылке, если был свайп.
  const handleClick = (e: React.MouseEvent) => {
      // Если был свайп (перетаскивание), предотвращаем переход по ссылке
      if (isSwiped) {
          e.preventDefault();
          e.stopPropagation();
      }
  };


  // const isMobileOrTablet = itemsPerPage === 2 || itemsPerPage === 4; // НЕ ИСПОЛЬЗУЕТСЯ - УДАЛЕНА ИЛИ ЗАКОММЕНТИРОВАНА

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className={styles.allTeamContainer}>
      <h2 className={styles.sectionTitle}>{t("allTeamTitle")}</h2>
      {/* 👈 Обертка для позиционирования стрелок относительно карусели */}
      <div className={styles.carouselWrapper}>
        
        {/* Кнопка "Назад" */}
        <button
          className={`${styles.navButton} ${styles.navPrev}`}
          onClick={handlePrev}
          disabled={currentPage === 1}
          aria-label={t("previousSlide")}
        >
          {"<"}
        </button>

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
                
                // 👈 КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Оборачиваем всю карточку в Link
                return (
                  <Link
                    key={member.id}
                    href={`/worker/${member.id}`}
                    className={styles.teamMemberCard} // Используем класс стилей для Link
                    onClick={handleClick} // Добавляем проверку на свайп
                  >
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
                          {/* ⚠️ УДАЛЕН ЛИШНИЙ Link ВОКРУГ ИМЕНИ */}
                          <div className={styles.memberName}>
                            {name}
                          </div>
                          <p className={styles.memberRole}>{role}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
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
        
        {/* Кнопка "Вперед" */}
        <button
          className={`${styles.navButton} ${styles.navNext}`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label={t("nextSlide")}
        >
          {">"}
        </button>

      </div>
    </div>
  );
};

export default AllTeamSection;
