// components/ConsultationModal/ConsultationModal.tsx

import { useEffect, useState, FormEvent } from "react";
import styles from "./ConsultationModal.module.css";
import { useTranslation } from "react-i18next";
import { useModal } from '../../../hooks/useModal';

export default function ConsultationModal() {
  const { t } = useTranslation("common");
  const { isModalOpen, closeModal, preselectedForWhom } = useModal();

  // State for form inputs
  const [clientName, setClientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Options for the custom dropdowns, with values matching backend enums
  const propertyOptions = [
    { value: "RESIDENTIAL", label: t("residential") },
    { value: "COMMERCIAL", label: t("commercial") },
  ];

  const forWhomOptions = [
    { value: "SELLING", label: t("forSellers") }, // Changed value to match backend 'SELLING'
    { value: "BUYING", label: t("forBuyers") },   // Changed value to match backend 'BUYING'
  ];

  // State for the custom dropdowns
  const [isPropertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const [isForWhomDropdownOpen, setForWhomDropdownOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(propertyOptions[0]);
  const [selectedForWhom, setSelectedForWhom] = useState(forWhomOptions[0]);
  
  // State for submission status
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Update selected value when preselectedForWhom changes
  useEffect(() => {
    if (preselectedForWhom) {
      // Find the correct option based on the preselectedForWhom value
      const mappedValue = preselectedForWhom === "forSellers" ? "SELLING" : "BUYING";
      const newSelection = forWhomOptions.find(opt => opt.value === mappedValue);
      if (newSelection) {
        setSelectedForWhom(newSelection);
      }
    } else {
      setSelectedForWhom(forWhomOptions[0]);
    }
  }, [preselectedForWhom]);

  // Handle closing modal
  const handleCloseModal = () => {
    // Reset form state on close
    setClientName("");
    setPhoneNumber("");
    setError("");
    setIsSubmitted(false);
    closeModal();
  };

  // Handle outside click to close modal
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

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Handle form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    // Prepare data to send to the backend
    const offerData = {
      clientName,
      phoneNumber,
      reason: selectedForWhom.value, // Use the value that matches the backend enum
      propertyType: selectedProperty.value, // Use the value that matches the backend enum
    };
    
    try {
      const response = await fetch("http://localhost:3001/offers", { // Замените URL на ваш бэкэнд-адрес
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong!");
      }

      setIsSubmitted(true); // Set success state
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isModalOpen) return null;

  // Show a success message after submission
  if (isSubmitted) {
    return (
      <div className={styles.modalOverlay} onClick={handleCloseModal}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
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
            <label className={styles.formLabel}>{t("yourName")}</label>
            <input 
              type="text" 
              placeholder={t("namePlaceholder")} 
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required 
            />
          </div>

          <div className={styles.formItem}>
            <label className={styles.formLabel}>{t("yourPhone")}</label>
            <input 
              type="tel" 
              placeholder={t("phonePlaceholder")} 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required 
            />
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