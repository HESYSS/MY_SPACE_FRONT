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

// Интерфейс для изображений
interface SiteImage {
  id: number;
  name: string;
  url: string;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [images, setImages] = useState<SiteImage[]>([]);

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

  const [isPartner, setIsPartner] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Новое состояние для загрузки файла
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Новое состояние для обновления изображения
  const [selectedImageToUpdate, setSelectedImageToUpdate] = useState<SiteImage | null>(null);

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
  
  // Новая функция для получения списка изображений
  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/images");
      if (response.ok) {
        const data: SiteImage[] = await response.json();
        setImages(data);
      } else {
        setError("Не удалось получить список изображений.");
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      setError("Ошибка сети при получении данных.");
    } finally {
      setLoading(false);
    }
  };
  
  // Новая функция для загрузки изображений
  const handleImageUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      alert("Пожалуйста, выберите файл для загрузки.");
      return;
    }
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3001/images/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Изображение успешно загружено!");
        setFile(null);
        await fetchImages(); // Обновляем список изображений
      } else {
        const errorData = await response.json();
        setError(`Ошибка при загрузке: ${errorData.message}`);
        alert(`Ошибка при загрузке: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      setError("Ошибка сети при загрузке файла.");
      alert("Ошибка сети при загрузке файла.");
    } finally {
      setUploading(false);
    }
  };

  // Новая функция для обновления изображения
  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !selectedImageToUpdate) {
      alert("Пожалуйста, выберите файл для обновления.");
      return;
    }
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`http://localhost:3001/images/${selectedImageToUpdate.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        alert("Изображение успешно обновлено!");
        setSelectedImageToUpdate(null);
        setFile(null);
        await fetchImages();
      } else {
        const errorData = await response.json();
        setError(`Ошибка при обновлении: ${errorData.message}`);
        alert(`Ошибка при обновлении: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      setError("Ошибка сети при обновлении файла.");
      alert("Ошибка сети при обновлении файла.");
    } finally {
      setUploading(false);
    }
  };

  // Новая функция для удаления изображения
  const handleImageDelete = async (imageId: number) => {
    const confirmation = window.confirm("Вы уверены, что хотите удалить это изображение? Это действие необратимо.");
    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/images/${imageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Изображение успешно удалено!");
        await fetchImages(); // Обновляем список изображений после удаления
      } else {
        const errorData = await response.json();
        alert(`Ошибка при удалении: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      alert("Ошибка сети при удалении изображения.");
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
    } else if (activeTab === "images") {
      fetchImages();
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
          className={`${styles.tabButton} ${activeTab === "images" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("images")}
        >
          Изображения
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
        {activeTab === "images" && (
          <div>
            <h2 className={styles.sectionTitle}>Управление изображениями</h2>
            <div className={styles.formGroup}>
              <form onSubmit={handleImageUpload} className={styles.imageForm}>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  required
                />
                <button type="submit" className={styles.submitBtn} disabled={uploading}>
                  {uploading ? "Загрузка..." : "Загрузить изображение"}
                </button>
              </form>
            </div>
            
            <hr className={styles.divider} />

            <h2 className={styles.sectionTitle}>Список загруженных изображений</h2>
            {loading && <p>Загрузка...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            {!loading && !error && images.length > 0 && (
              <div className={styles.imageList}>
                {images.map(image => (
                  <div key={image.id} className={styles.imageCard}>
                    <img src={image.url} alt={image.name} className={styles.imagePreview} />
                    <div className={styles.imageInfo}>
                      <p><strong>Название:</strong> {image.name}</p>
                      <p><strong>URL:</strong> <a href={image.url} target="_blank" rel="noopener noreferrer">{image.url}</a></p>
                      <div className={styles.imageActions}>
                        <button
                          className={styles.updateBtn}
                          onClick={() => setSelectedImageToUpdate(image)}
                        >
                          Обновить
                        </button>
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => handleImageDelete(image.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && !error && images.length === 0 && (
              <p>Список изображений пуст. Загрузите первое изображение.</p>
            )}
          </div>
        )}
        {selectedImageToUpdate && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Обновить изображение: {selectedImageToUpdate.name}</h3>
              <p>Выберите новый файл для замены текущего.</p>
              <form onSubmit={handleUpdate}>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  required
                />
                <div className={styles.modalActions}>
                  <button type="submit" className={styles.submitBtn} disabled={uploading}>
                    {uploading ? "Обновление..." : "Обновить"}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => {
                      setSelectedImageToUpdate(null);
                      setFile(null);
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
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