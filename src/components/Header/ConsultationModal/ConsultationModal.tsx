// components/ConsultationModal.tsx

import { useEffect } from "react";
import styles from "./ConsultationModal.module.css";
import { useTranslation } from "react-i18next"; // Импортируем хук

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({
  isOpen,
  onClose,
}: ConsultationModalProps) {
  const { t } = useTranslation("common"); // Подключаем переводы из common.json

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{t("modalTitle")}</h2>
        <form className={styles.form}>
          <div className={styles.formItem}>
            <label className={styles.formLabel}>{t("yourName")}</label>
            <input type="text" placeholder={t("namePlaceholder")} required />
          </div>

          <div className={styles.formItem}>
            <label className={styles.formLabel}>{t("yourPhone")}</label>
            <input type="tel" placeholder={t("phonePlaceholder")} required />
          </div>

          <div className={styles.formItem}>
            <label className={styles.formLabel}>{t("propertyProfile")}</label>
            <select required>
              <option value="residential">{t("residential")}</option>
            </select>
          </div>

          <div className={styles.formItem}>
            <label className={styles.formLabel}>{t("forWhom")}</label>
            <select required>
              <option value="sellers">{t("forSellers")}</option>
            </select>
          </div>

          <div className={styles.formFooter}>
            <button type="submit">{t("send")}</button>
          </div>
        </form>

        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}