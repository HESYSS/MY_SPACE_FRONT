// OffersSection.tsx

import React, { FC } from 'react';
import { Offer } from '../../../types/interface'; // <--- НОВИЙ ІМПОРТ З ЄДИНОГО ДЖЕРЕЛА

// 2. Створення інтерфейсу для пропсів
interface OffersSectionProps {
  styles: Record<string, string>; // Тип для стилів (якщо це CSS Modules)
  loading: boolean;
  error: string | null;
  offers: Offer[];
  handleUpdateStatus: (offerId: number, newStatus: Offer['status']) => Promise<void>;
  getStatusLabel: (status: Offer['status']) => string;
}

// 3. Застосування інтерфейсу до компонента
const OffersSection: FC<OffersSectionProps> = ({ 
  styles, 
  loading, 
  error, 
  offers, 
  handleUpdateStatus, 
  getStatusLabel 
}) => {
  return (
    <div className={styles.offersSection}>
      <h2 className={styles.sectionTitle}>Заявки на співпрацю</h2>
      <p>Останні заявки в порядку від нових до старих.</p>
      <hr className={styles.divider} />
      {loading && <p>Завантаження...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {!loading && !error && offers.length > 0 && (
        <div className={styles.offerList}>
          {offers.map((offer: Offer) => ( // Явна типізація елемента 'offer' у map
            <div key={offer.id} className={styles.offerCard}>
              <div className={styles.offerCardContent}>
                <div>
                  <p>
                    <strong>Ім'я:</strong> {offer.clientName}
                  </p>
                  <p>
                    <strong>Телефон:</strong> {offer.phoneNumber}
                  </p>
                  <p>
                    <strong>Причина:</strong>{" "}
                    {offer.reason === "BUYING"
                      ? "Купівля/Оренда"
                      : "Продаж/Здача"}
                  </p>
                  <p>
                    <strong>Тип нерухомості:</strong>{" "}
                    {offer.propertyType === "RESIDENTIAL"
                      ? "Житлова"
                      : offer.propertyType === "COMMERCIAL"
                      ? "Комерційна"
                      : "Земельна ділянка"}
                  </p>
                  <p>
                    <strong>Час створення:</strong>{" "}
                    {new Date(offer.createdAt).toLocaleString("uk-UA")}
                  </p>
                  <p>
                    <strong>Статус:</strong>{" "}
                    <span
                      className={`${styles.statusBadge} ${
                        styles[offer.status.toLowerCase()]
                      }`}
                    >
                      {getStatusLabel(offer.status)}
                    </span>
                  </p>
                </div>
                <div className={styles.offerActions}>
                  <button
                    className={styles.statusBtn}
                    onClick={() =>
                      handleUpdateStatus(offer.id, "PENDING")
                    }
                    disabled={offer.status === "PENDING"}
                  >
                    Не розглянуто
                  </button>
                  <button
                    className={styles.statusBtn}
                    onClick={() =>
                      handleUpdateStatus(offer.id, "PROCESSED")
                    }
                    disabled={offer.status === "PROCESSED"}
                  >
                    Опрацьовано
                  </button>
                  <button
                    className={styles.statusBtn}
                    onClick={() =>
                      handleUpdateStatus(offer.id, "COMPLETED")
                    }
                    disabled={offer.status === "COMPLETED"}
                  >
                    Завершено
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && offers.length === 0 && (
        <p>Список заявок порожній.</p>
      )}
    </div>
  );
};

export default OffersSection;