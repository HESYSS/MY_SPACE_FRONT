import React, { useState, useEffect } from "react";
import styles from './admin.module.css';

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
  isPARTNER: boolean;
  isMANAGER: boolean;
  isACTIVE: boolean;
}

// Новые интерфейсы для офферов
interface Offer {
  id: number;
  clientName: string;
  reason: string;
  propertyType: string;
  phoneNumber: string;
  createdAt: string;
  status: 'PENDING' | 'PROCESSED' | 'COMPLETED';
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]); // Состояние для офферов

  // Состояния для полей
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [experienceYears, setExperienceYears] = useState<string | undefined>(undefined);
  const [profile, setProfile] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [firstNameEn, setFirstNameEn] = useState("");
  const [lastNameEn, setLastNameEn] = useState("");
  const [positionEn, setPositionEn] = useState("");
  const [profileEn, setProfileEn] = useState("");
  const [aboutMeEn, setAboutMeEn] = useState("");
  
  // Новые состояния для булевых полей
  const [isPartner, setIsPartner] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Функции для работы с данными
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/employee");
      if (response.ok) {
        const data: Employee[] = await response.json();
        setEmployees(data);
      } else {
        setError("Не удалось получить список работников.");
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      setError("Ошибка сети при получении данных.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/offers");
      if (response.ok) {
        const data: Offer[] = await response.json();
        setOffers(data);
      } else {
        setError("Не удалось получить список офферов.");
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      setError("Ошибка сети при получении данных.");
    } finally {
      setLoading(false);
    }
  };

  // Изменение статуса оффера
  const handleUpdateStatus = async (offerId: number, newStatus: Offer['status']) => {
    const confirmation = window.confirm(`Вы уверены, что хотите изменить статус оффера на "${newStatus}"?`);
    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/offers/${offerId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert("Статус оффера успешно изменен!");
        fetchOffers(); // Обновляем список офферов после успешного изменения
      } else {
        const errorData = await response.json();
        alert(`Ошибка при изменении статуса: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      alert("Ошибка сети при изменении статуса.");
    }
  };

  useEffect(() => {
    if (activeTab === "employees") {
      fetchEmployees();
    } else if (activeTab === "offers") {
      fetchOffers();
    }
  }, [activeTab]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const employeeData = {
      firstName, lastName, position,
      experienceYears: experienceYears ? Number(experienceYears) : undefined,
      profile: profile || undefined, aboutMe: aboutMe || undefined,
      firstNameEn: firstNameEn || undefined, lastNameEn: lastNameEn || undefined,
      positionEn: positionEn || undefined, profileEn: profileEn || undefined,
      aboutMeEn: aboutMeEn || undefined,
      isPARTNER: isPartner, isMANAGER: isManager, isACTIVE: isActive,
    };
    try {
      const response = await fetch("http://localhost:3001/employee/create", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(employeeData),
      });
      if (response.ok) {
        alert("Работник успешно добавлен!");
        fetchEmployees();
        // Reset form
        setFirstName(""); setLastName(""); setPosition(""); setExperienceYears(undefined);
        setProfile(""); setAboutMe(""); setFirstNameEn(""); setLastNameEn("");
        setPositionEn(""); setProfileEn(""); setAboutMeEn("");
        setIsPartner(false); setIsManager(false); setIsActive(false);
        setIsFormVisible(false);
      } else {
        const errorData = await response.json();
        alert(`Ошибка при добавлении работника: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      alert("Ошибка при отправке данных.");
    }
  };

  const handleDelete = async (employeeId: number) => {
    const confirmation = window.confirm("Вы уверены, что хотите удалить этого работника?");
    if (!confirmation) { return; }
    try {
      const response = await fetch(`http://localhost:3001/employee/${employeeId}`, { method: "DELETE" });
      if (response.ok) {
        alert("Работник успешно удален!");
        fetchEmployees();
      } else {
        alert("Ошибка при удалении работника.");
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      alert("Ошибка при удалении данных.");
    }
  };
  
  // Хелпер-функция для перевода статусов
  const getStatusLabel = (status: Offer['status']) => {
    switch(status) {
      case 'PENDING': return 'Не рассмотрен';
      case 'PROCESSED': return 'Обработан';
      case 'COMPLETED': return 'Завершен';
      default: return status;
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Админ-панель</h1>
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === "employees" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("employees")}
        >
          Работники
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "offers" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("offers")}
        >
          Офферы
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "products" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Продукты
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "settings" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Настройки
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "employees" && (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Работники</h2>
              <button
                className={styles.toggleButton}
                onClick={() => setIsFormVisible(!isFormVisible)}
              >
                {isFormVisible ? "Скрыть форму" : "Добавить нового работника"}
              </button>
            </div>
            
            {isFormVisible && (
              <form onSubmit={handleSubmit} className={styles.employeeForm}>
                {/* ... existing form ... */}
              </form>
            )}

            <hr className={styles.divider} />

            <h2 className={styles.sectionTitle}>Список работников</h2>
            {loading && <p>Загрузка...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            {!loading && !error && employees.length > 0 && (
              <div className={styles.employeeList}>
                {employees.map((employee) => (
                  <div key={employee.id} className={styles.employeeCard}>
                    <div className={styles.employeeCardContent}>
                      <div>
                        <p>
                          <strong>{employee.firstName} {employee.lastName}</strong>
                          {employee.isPARTNER && <span className={styles.statusTag}> (Партнёр)</span>}
                          {employee.isMANAGER && <span className={styles.statusTag}> (Менеджер)</span>}
                          {employee.isACTIVE && <span className={styles.statusTag}> (Активный)</span>}
                        </p>
                        <p>Должность: {employee.position}</p>
                        {employee.experienceYears && <p>Опыт: {employee.experienceYears} лет</p>}
                        {employee.profile && <p>Профиль: {employee.profile}</p>}
                        {employee.aboutMe && <p>О себе: {employee.aboutMe}</p>}
                        {employee.firstNameEn && <p><strong>{employee.firstNameEn} {employee.lastNameEn}</strong></p>}
                        {employee.positionEn && <p>Position: {employee.positionEn}</p>}
                        {employee.profileEn && <p>Profile: {employee.profileEn}</p>}
                        {employee.aboutMeEn && <p>About Me: {employee.aboutMeEn}</p>}
                      </div>
                      <button 
                        className={styles.deleteBtn} 
                        onClick={() => handleDelete(employee.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && !error && employees.length === 0 && (
              <p>Список работников пуст.</p>
            )}
          </div>
        )}
        {activeTab === "offers" && (
          <div className={styles.offersSection}>
            <h2 className={styles.sectionTitle}>Офферы на сотрудничество</h2>
            <p>Последние офферы в порядке от новых к старым.</p>
            <hr className={styles.divider} />
            {loading && <p>Загрузка...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            {!loading && !error && offers.length > 0 && (
              <div className={styles.offerList}>
                {offers.map((offer) => (
                  <div key={offer.id} className={styles.offerCard}>
                    <div className={styles.offerCardContent}>
                      <div>
                        <p><strong>Имя:</strong> {offer.clientName}</p>
                        <p><strong>Телефон:</strong> {offer.phoneNumber}</p>
                        <p><strong>Причина:</strong> {offer.reason === 'BUYING' ? 'Покупка/Аренда' : 'Продажа/Сдача'}</p>
                        <p><strong>Тип недвижимости:</strong> {offer.propertyType === 'RESIDENTIAL' ? 'Жилая' : offer.propertyType === 'COMMERCIAL' ? 'Коммерческая' : 'Земельный участок'}</p>
                        <p><strong>Время создания:</strong> {new Date(offer.createdAt).toLocaleString()}</p>
                        <p><strong>Статус:</strong> <span className={`${styles.statusBadge} ${styles[offer.status.toLowerCase()]}`}>{getStatusLabel(offer.status)}</span></p>
                      </div>
                      <div className={styles.offerActions}>
                        <button
                          className={styles.statusBtn}
                          onClick={() => handleUpdateStatus(offer.id, 'PENDING')}
                          disabled={offer.status === 'PENDING'}
                        >
                          Не рассмотрен
                        </button>
                        <button
                          className={styles.statusBtn}
                          onClick={() => handleUpdateStatus(offer.id, 'PROCESSED')}
                          disabled={offer.status === 'PROCESSED'}
                        >
                          Обработан
                        </button>
                        <button
                          className={styles.statusBtn}
                          onClick={() => handleUpdateStatus(offer.id, 'COMPLETED')}
                          disabled={offer.status === 'COMPLETED'}
                        >
                          Завершен
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && !error && offers.length === 0 && (
              <p>Список офферов пуст.</p>
            )}
          </div>
        )}
        {activeTab === "products" && (
          <div>
            <h2 className={styles.sectionTitle}>Страница продуктов</h2>
            <p className={styles.emptyTabMessage}>Здесь будет контент для продуктов.</p>
          </div>
        )}
        {activeTab === "settings" && (
          <div>
            <h2 className={styles.sectionTitle}>Страница настроек</h2>
            <p className={styles.emptyTabMessage}>Здесь будет контент для настроек.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;