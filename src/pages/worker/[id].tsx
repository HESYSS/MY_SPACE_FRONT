import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./worker.module.css";
import { useRouter } from "next/router";

// Определяем интерфейс для данных работника, чтобы обеспечить безопасность типов
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  experienceYears?: number;
  profile?: string;
  aboutMe?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  positionEn?: string;
  profileEn?: string;
  aboutMeEn?: string;
}

const EmployeePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { i18n } = useTranslation();

  // Состояние для хранения данных работника и статуса загрузки
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Используем useEffect для выполнения асинхронного запроса к бэкенду
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:3001/employee/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setEmployee(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!employee) {
    return <div>Сотрудник не найден.</div>;
  }

  // Функция для получения данных в зависимости от текущего языка
  const getEmployeeData = () => {
    const isEnglish = i18n.language === "en";
    return {
      firstName:
        isEnglish && employee.firstNameEn
          ? employee.firstNameEn
          : employee.firstName,
      lastName:
        isEnglish && employee.lastNameEn
          ? employee.lastNameEn
          : employee.lastName,
      position:
        isEnglish && employee.positionEn
          ? employee.positionEn
          : employee.position,
      profile:
        isEnglish && employee.profileEn ? employee.profileEn : employee.profile,
      aboutMe:
        isEnglish && employee.aboutMeEn ? employee.aboutMeEn : employee.aboutMe,
    };
  };

  const currentData = getEmployeeData();

  return (
    <div className={styles.mainDiv}>
      <div className={styles.containerWithOval}>
        <div className={styles.glowingOval}></div>
        {/* Title block */}
        <div className={styles.titleArea}>
          <div className={styles.titleLine}></div>
          <h2 className={styles.readMoreTitle}>
            {i18n.language === "en" ? "Read more" : "Читать далее"}
          </h2>
        </div>
        {/* Employee information block wrapped in a new container */}
        <div className={styles.contactsBlockWrapper}>
          <div className={styles.contactsBlock}>
            <div className={styles.frame301}>
              {/* Photo and name/role info on the left */}
              <div className={styles.photoContainer}>
                <img
                  src={`https://placehold.co/200x200/cccccc/000000?text=${currentData.firstName[0]}${currentData.lastName[0]}`}
                  alt={`${currentData.firstName} ${currentData.lastName}`}
                  className={styles.employeePhoto}
                />
              </div>

              {/* Details on the right */}
              <div className={styles.infoContainer}>
                <div className={styles.nameAndRole}>
                  <h3 className={styles.employeeName}>
                    {currentData.firstName} {currentData.lastName}
                  </h3>
                  <p className={styles.employeeRole}>{currentData.position}</p>
                </div>

                <div className={styles.line17}></div>

                {/* Additional info blocks */}
                <div className={styles.additionalInfo}>
                  <div className={styles.infoSection}>
                    <h4 className={styles.infoTitle}>
                      {i18n.language === "en" ? "Experience" : "Досвід"}
                    </h4>
                    <p className={styles.infoText}>
                      {employee.experienceYears}{" "}
                      {i18n.language === "en" ? "years" : "років"}
                    </p>
                  </div>

                  <div className={styles.infoSection}>
                    <h4 className={styles.infoTitle}>
                      {i18n.language === "en" ? "Profile" : "Профіль"}
                    </h4>
                    <p className={styles.infoText}>{currentData.profile}</p>
                  </div>

                  <div className={styles.infoSection}>
                    <h4 className={styles.infoTitle}>
                      {i18n.language === "en" ? "About me" : "Про себе"}
                    </h4>
                    <p className={styles.infoText}>{currentData.aboutMe}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.coworking}>
          <h3 className={styles.callToAction}>
            {i18n.language === "en"
              ? "Sign up for a consultation"
              : "Запишитесь на консультацию"}
          </h3>
          <div className={styles.frame89}>
            <div className={styles.frame88}>
              <div className={styles.optionRow}>
                <div className={styles.frame87}>
                  <div className={styles.line16}></div>
                  <div className={styles.frame86}>
                    <p className={styles.optionText}>
                      {i18n.language === "en"
                        ? "For sellers and landlords"
                        : "Для продавцов и арендодателей"}
                    </p>
                    <svg
                      className={styles.arrowIcon}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
              <div className={styles.optionRow}>
                <div className={styles.frame85}>
                  <div className={styles.line17}></div>
                  <div className={styles.frame84}>
                    <p className={styles.optionText}>
                      {i18n.language === "en"
                        ? "For buyers and tenants"
                        : "Для покупателей и арендаторов"}
                    </p>
                    <svg
                      className={styles.arrowIcon}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
