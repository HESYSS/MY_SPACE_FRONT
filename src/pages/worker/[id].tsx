import React, { useState, useEffect, memo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import arrowRight from "../../../public/icons/line.svg";
import styles from "./worker.module.css";
import { useModal } from "../../hooks/useModal";

// Обновленный интерфейс для данных работника с полем photoUrl
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
  photoUrl?: string; // <-- ДОБАВЛЕНО
}

const EmployeePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t, i18n } = useTranslation();
  const { openModal } = useModal();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const backendUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${backendUrl}/employee/${id}`);
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
    return <div>{t("loading")}...</div>;
  }

  if (error) {
    return (
      <div>
        {t("error")}: {error}
      </div>
    );
  }

  if (!employee) {
    return <div>{t("employeeNotFound")}</div>;
  }

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
          <h2 className={styles.readMoreTitle}>{t("readMoreTitle")}</h2>
        </div>
        {/* Employee information block wrapped in a new container */}
        <div className={styles.contactsBlockWrapper}>
          <div className={styles.contactsBlock}>
            <div className={styles.frame301}>
              <div className={styles.photoContainer}>
                {/* Условный рендеринг: если есть photoUrl, используем его, иначе - заглушку */}
                {employee.photoUrl ? (
                  <img
                    src={employee.photoUrl} // <-- ИСПОЛЬЗУЕМ РЕАЛЬНЫЙ URL
                    alt={`${currentData.firstName} ${currentData.lastName}`}
                    className={styles.employeePhoto}
                  />
                ) : (
                  <img
                    src={`https://placehold.co/200x200/cccccc/000000?text=${currentData.firstName[0]}${currentData.lastName[0]}`}
                    alt={`${currentData.firstName} ${currentData.lastName}`}
                    className={styles.employeePhoto}
                  />
                )}
              </div>
              <div className={styles.infoContainer}>
                <div className={styles.nameAndRole}>
                  <h3 className={styles.employeeName}>
                    {currentData.firstName} {currentData.lastName}
                  </h3>
                  <p className={styles.employeeRole}>{currentData.position}</p>
                </div>
                <div className={styles.line17}></div>
                <div className={styles.additionalInfo}>
                  <div className={styles.infoSection}>
                    <h4 className={styles.infoTitle}>{t("experience")}</h4>
                    <p className={styles.infoText}>
                      {employee.experienceYears} {t("years")}
                    </p>
                  </div>
                  <div className={styles.infoSection}>
                    <h4 className={styles.infoTitle}>{t("profile")}</h4>
                    <p className={styles.infoText}>{currentData.profile}</p>
                  </div>
                  <div className={styles.infoSection}>
                    <h4 className={styles.infoTitle}>{t("aboutMe")}</h4>
                    <p className={styles.infoText}>{currentData.aboutMe}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Исправленный блок сотрудничества с обработчиками onClick */}
        <div className={styles.coworking}>
          <h3 className={styles.callToAction}>
            {t("consultationCallToAction")}
          </h3>
          <div className={styles.frame89}>
            <div className={styles.frame88}>
              {/* Блок для Sellers/Landlords */}
              <div
                className={styles.optionRow}
                onClick={() => openModal("forSellers")}
              >
                <div className={styles.frame87}>
                  <div className={styles.line16}></div>
                  <div className={styles.frame86}>
                    <p className={styles.optionText}>
                      {t("forSellersLandlords")}
                    </p>
                    <Image
                      src={arrowRight}
                      alt={t("arrowRightAlt")}
                      className={styles.arrowIcon}
                    />
                  </div>
                </div>
              </div>
              {/* Блок для Buyers/Tenants */}
              <div
                className={styles.optionRow}
                onClick={() => openModal("forBuyers")}
              >
                <div className={styles.frame85}>
                  <div className={styles.line18}></div>
                  <div className={styles.frame84}>
                    <p className={styles.optionText}>{t("forBuyersTenants")}</p>
                    <Image
                      src={arrowRight}
                      alt={t("arrowRightAlt")}
                      className={styles.arrowIcon}
                    />
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

export default memo(EmployeePage);
