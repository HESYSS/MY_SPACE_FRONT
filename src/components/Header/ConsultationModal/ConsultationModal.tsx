// components/ConsultationModal.tsx
import { useEffect } from "react";
import styles from "./ConsultationModal.module.css";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({
  isOpen,
  onClose,
}: ConsultationModalProps) {
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
        <h2 className={styles.modalTitle}>Отримати консультацію</h2>
        <form className={styles.form}>
          <div className={styles.formItem}>
            <label className={styles.formLabel}>Ваше Ім&apos;я</label>
            <input type="text" placeholder="Ім'я" required />
          </div>

          <div className={styles.formItem}>
            <label className={styles.formLabel}>Ваш телефон</label>
            <input type="tel" placeholder="+380 -- --- -- --" required />
          </div>

          <div className={styles.formItem}>
            <label className={styles.formLabel}>Профіль нерухомості</label>
            <select required>
              <option value="residential">Житлова</option>
            </select>
          </div>

          <div className={styles.formItem}>
            <label className={styles.formLabel}>Для кого консультація?</label>
            <select required>
              <option value="sellers">Продавцям/Орендодавцям</option>
            </select>
          </div>

          <div className={styles.formFooter}>
            <button type="submit">Відправити</button>
          </div>
        </form>

        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}
