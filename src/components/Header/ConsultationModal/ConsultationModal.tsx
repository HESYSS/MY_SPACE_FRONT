import { useEffect, useState, FormEvent } from "react";
import styles from "./ConsultationModal.module.css";
import { useTranslation } from "react-i18next";
import { useModal } from "../../../hooks/useModal";

export default function ConsultationModal() {
  const { t } = useTranslation("common");
  const { isModalOpen, closeModal, preselectedForWhom } = useModal();

  const [clientName, setClientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const propertyOptions = [
    { value: "RESIDENTIAL", label: t("residential") },
    { value: "COMMERCIAL", label: t("commercial") },
  ];

  const forWhomOptions = [
    { value: "SELLING", label: t("forSellers") },
    { value: "BUYING", label: t("forBuyers") },
  ];

  const [isPropertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const [isForWhomDropdownOpen, setForWhomDropdownOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(propertyOptions[0]);
  const [selectedForWhom, setSelectedForWhom] = useState(forWhomOptions[0]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (preselectedForWhom) {
      const mappedValue =
        preselectedForWhom === "forSellers" ? "SELLING" : "BUYING";
      const newSelection = forWhomOptions.find(
        (opt) => opt.value === mappedValue
      );
      if (newSelection) {
        setSelectedForWhom(newSelection);
      }
    } else {
      setSelectedForWhom(forWhomOptions[0]);
    }
  }, [preselectedForWhom]);

  const handleCloseModal = () => {
    setClientName("");
    setPhoneNumber("");
    setError("");
    setNameError("");
    setPhoneError("");
    setIsSubmitted(false);
    closeModal();
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const modalContent = document.querySelector(`.${styles.modalContent}`);
      if (modalContent && !modalContent.contains(event.target as Node)) {
        handleCloseModal();
      }
    };
    if (isModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Обработчик изменения для поля телефона с фильтрацией на только цифры
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Оставляем только цифры
    const onlyNums = e.target.value.replace(/[^0-9]/g, "");
    setPhoneNumber(onlyNums);
    // Сбрасываем ошибку при вводе
    if (onlyNums) {
      setPhoneError("");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setNameError("");
    setPhoneError("");

    // --- Клиентская валидация (проверка обязательных полей) ---
    let isValid = true;

    if (!clientName.trim()) {
      setNameError(t("nameRequired"));
      isValid = false;
    } else {
      setNameError("");
    }

    if (!phoneNumber.trim()) {
      setPhoneError(t("phoneRequired"));
      isValid = false;
    } else if (phoneNumber.replace(/[^0-9]/g, "").length < 5) {
      // Пример: проверка на минимальную длину номера
      setPhoneError(t("phoneTooShort"));
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!isValid) {
      return; // Если есть ошибки валидации, прерываем отправку
    }
    // ------------------------------------------------------------------

    setIsLoading(true);

    const offerData = {
      clientName,
      phoneNumber,
      reason: selectedForWhom.value,
      propertyType: selectedProperty.value,
    };

    try {
      const backendUrl = process.env.REACT_APP_API_URL;

      const response = await fetch(`${backendUrl}/offers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(offerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong!");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isModalOpen) return null;

  if (isSubmitted) {
    return (
      <div className={styles.modalOverlay} onClick={handleCloseModal}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className={styles.modalTitle}>{t("successTitle")}</h2>
          <p className={styles.successMessage}>{t("successMessage")}</p>
          <button className={styles.closeBtn} onClick={handleCloseModal}>
            ✖
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay} onClick={handleCloseModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{t("modalTitle")}</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formItem}>
            <label className={styles.formLabel}>
              {t("yourName")} <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder={t("namePlaceholder")}
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                if (e.target.value) setNameError("");
              }}
              // required убран, используется ручная валидация
            />
            {nameError && <p className={styles.validationError}>{nameError}</p>}
          </div>

          <div className={styles.formItem}>
            <label className={styles.formLabel}>
              {t("yourPhone")} <span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              placeholder={t("phonePlaceholder")}
              value={phoneNumber}
              // Новый обработчик для ввода только цифр
              onChange={handlePhoneNumberChange}
              inputMode="numeric"
              pattern="[0-9]*"
              // required убран, используется ручная валидация
            />
            {phoneError && (
              <p className={styles.validationError}>{phoneError}</p>
            )}
          </div>

          <div className={styles.formItem}>
            <label className={styles.formLabel}>{t("propertyProfile")}</label>
            <div
              className={`${styles.customSelect} ${
                isPropertyDropdownOpen ? styles.open : ""
              }`}
            >
              <div
                className={styles.selectHeader}
                onClick={() => setPropertyDropdownOpen(!isPropertyDropdownOpen)}
              >
                {selectedProperty.label}
                <span className={styles.arrow}>▼</span>
              </div>
              {isPropertyDropdownOpen && (
                <div className={styles.optionsList}>
                  {propertyOptions.map((option) => (
                    <div
                      key={option.value}
                      className={styles.optionItem}
                      onClick={() => {
                        setSelectedProperty(option);
                        setPropertyDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formItem}>
            <label className={styles.formLabel}>{t("forWhom")}</label>
            <div
              className={`${styles.customSelect} ${
                isForWhomDropdownOpen ? styles.open : ""
              }`}
            >
              <div
                className={styles.selectHeader}
                onClick={() => setForWhomDropdownOpen(!isForWhomDropdownOpen)}
              >
                {selectedForWhom.label}
                <span className={styles.arrow}>▼</span>
              </div>
              {isForWhomDropdownOpen && (
                <div className={styles.optionsList}>
                  {forWhomOptions.map((option) => (
                    <div
                      key={option.value}
                      className={styles.optionItem}
                      onClick={() => {
                        setSelectedForWhom(option);
                        setForWhomDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.formFooter}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? t("sending") : t("send")}
            </button>
          </div>
        </form>

        <button className={styles.closeBtn} onClick={handleCloseModal}>
          ✖
        </button>
      </div>
    </div>
  );
}
