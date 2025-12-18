import { useEffect, useState, FormEvent } from "react";
import styles from "./ConsultationModal.module.css";
import { useTranslation } from "react-i18next";
import { useModal } from "../../../hooks/useModal";

// --- ФУНКЦИЯ ФОРМАТИРОВАНИЯ ТЕЛЕФОНА ---
const formatPhoneNumber = (value: string): string => {
  // Оставляем только цифры
  const onlyNums = value.replace(/[^\d]/g, "");

  // Начальная маска: +380
  let formatted = "+380";
  const remaining = onlyNums.substring(3); // Оставляем все после +380

  if (!remaining) return onlyNums.length > 3 ? "+380" : onlyNums; // Если введено 3 цифры (+380)

  // +380 (XX) XXX-XX-XX
  if (remaining.length > 0) {
    // Код оператора (XX)
    formatted += ` (${remaining.substring(0, 2)}`;
  }
  if (remaining.length > 2) {
    // Промежуток
    formatted += `) ${remaining.substring(2, 5)}`;
  }
  if (remaining.length > 5) {
    // Вторая группа (XX)
    formatted += `-${remaining.substring(5, 7)}`;
  }
  if (remaining.length > 7) {
    // Третья группа (XX)
    formatted += `-${remaining.substring(7, 9)}`;
  }

  // Возвращаем отформатированную строку
  return formatted;
};

// --- ОСНОВНОЙ КОМПОНЕНТ ---

export default function ConsultationModal() {
  const { t } = useTranslation("common");
  const { isModalOpen, closeModal, preselectedForWhom, propertyArticle } =
    useModal();

  const [clientName, setClientName] = useState("");
  // Инициализируем phoneNumber с маской, но только после открытия модалки
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
    // Логика предустановки для whom
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

    // Логика инициализации для модалки:
    if (isModalOpen) {
      // Инициализируем номер телефона только кодом страны при открытии
      setPhoneNumber("+380");
    }
  }, [preselectedForWhom, isModalOpen]);

  const handleCloseModal = () => {
    setClientName("");
    setPhoneNumber("+380"); // Сброс на маску
    setError("");
    setNameError("");
    setPhoneError("");
    setIsSubmitted(false);
    closeModal();
  };

  useEffect(() => {
    // ... (Обработчики клика вне модалки и Esc)
    const handleOutsideClick = (event: MouseEvent) => {
      const modalContent = document.querySelector(`.${styles.modalContent}`);
      const dropdowns = document.querySelectorAll(`.${styles.customSelect}`);

      let clickedInsideDropdown = false;
      dropdowns.forEach((dropdown) => {
        if (dropdown.contains(event.target as Node)) {
          clickedInsideDropdown = true;
        }
      });

      if (
        isModalOpen &&
        modalContent &&
        !modalContent.contains(event.target as Node) &&
        !clickedInsideDropdown
      ) {
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

  // ИЗМЕНЕНИЕ 2: Обработчик изменения для поля телефона с форматированием по маске
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Всегда начинаем с +380
    if (!value.startsWith("+380")) {
      setPhoneNumber("+380");
      return;
    }

    // Применяем форматирование
    const formatted = formatPhoneNumber(value);

    // Ограничиваем максимальную длину
    if (formatted.length <= "+380 (00) 000-00-00".length) {
      setPhoneNumber(formatted);
    }

    // Сбрасываем ошибку при вводе
    if (formatted.length > 4) {
      // После +380
      setPhoneError("");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setNameError("");
    setPhoneError("");

    // --- Валидация ---
    let isValid = true;

    // ... (валидация имени)
    if (!clientName.trim()) {
      setNameError(t("nameRequired"));
      isValid = false;
    } else {
      setNameError("");
    }

    // ОЧИЩАЕМ номер от маски для отправки на бэкенд и для валидации
    const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, "");

    if (!cleanPhoneNumber || cleanPhoneNumber === "380") {
      setPhoneError(t("phoneRequired"));
      isValid = false;
    } else if (cleanPhoneNumber.length < 12) {
      // 12 цифр для +380 XXXXXXXXX
      setPhoneError(t("phoneTooShort"));
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!isValid) {
      return;
    }
    // ------------------------------------------------------------------

    setIsLoading(true);

    const offerData = {
      clientName,
      // ИЗМЕНЕНИЕ 3: Отправляем очищенный номер
      phoneNumber: cleanPhoneNumber,
      reason: selectedForWhom.value,
      propertyType: selectedProperty.value,
      ...(propertyArticle && { propertyArticle: propertyArticle }),
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

        {propertyArticle && (
          <p className={styles.articleInfo}>
            {t("object_article")}: <strong>{propertyArticle}</strong>
          </p>
        )}

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
            />
            {nameError && <p className={styles.validationError}>{nameError}</p>}
          </div>

          <div className={styles.formItem}>
            <label className={styles.formLabel}>
              {t("yourPhone")} <span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              placeholder="+380 (XX) XXX-XX-XX" // Новый placeholder для маски
              value={phoneNumber}
              // Новый обработчик с маскированием
              onChange={handlePhoneNumberChange}
              inputMode="numeric"
              pattern="[0-9+() -]*" // Для поддержки символов маски в браузере
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
