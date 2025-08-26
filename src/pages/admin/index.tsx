// AdminPage.tsx
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
  // Новые булевы поля
  isPARTNER: boolean;
  isMANAGER: boolean;
  isACTIVE: boolean;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  
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

  useEffect(() => {
    if (activeTab === "employees") {
      fetchEmployees();
    }
  }, [activeTab]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const employeeData = {
      firstName,
      lastName,
      position,
      experienceYears: experienceYears ? Number(experienceYears) : undefined,
      profile: profile || undefined,
      aboutMe: aboutMe || undefined,
      firstNameEn: firstNameEn || undefined,
      lastNameEn: lastNameEn || undefined,
      positionEn: positionEn || undefined,
      profileEn: profileEn || undefined,
      aboutMeEn: aboutMeEn || undefined,
      // Добавляем новые булевы поля
      isPARTNER: isPartner,
      isMANAGER: isManager,
      isACTIVE: isActive,
    };

    try {
      const response = await fetch("http://localhost:3001/employee/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        alert("Работник успешно добавлен!");
        fetchEmployees();
        setFirstName("");
        setLastName("");
        setPosition("");
        setExperienceYears(undefined);
        setProfile("");
        setAboutMe("");
        setFirstNameEn("");
        setLastNameEn("");
        setPositionEn("");
        setProfileEn("");
        setAboutMeEn("");
        // Сбрасываем новые поля
        setIsPartner(false);
        setIsManager(false);
        setIsActive(false);
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
    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/employee/${employeeId}`, {
        method: "DELETE",
      });

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
                {/* Русские поля */}
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">Имя*</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Фамилия*</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="position">Должность*</label>
                  <input
                    type="text"
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="experienceYears">Опыт работы (лет)</label>
                  <input
                    type="number"
                    id="experienceYears"
                    value={experienceYears || ""}
                    onChange={(e) => setExperienceYears(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="profile">Профиль</label>
                  <input
                    type="text"
                    id="profile"
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="aboutMe">О себе</label>
                  <textarea
                    id="aboutMe"
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                  />
                </div>
                <hr className={styles.divider} />
                {/* Английские поля */}
                <div className={styles.formGroup}>
                  <label htmlFor="firstNameEn">First Name (English)</label>
                  <input
                    type="text"
                    id="firstNameEn"
                    value={firstNameEn}
                    onChange={(e) => setFirstNameEn(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastNameEn">Last Name (English)</label>
                  <input
                    type="text"
                    id="lastNameEn"
                    value={lastNameEn}
                    onChange={(e) => setLastNameEn(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="positionEn">Position (English)</label>
                  <input
                    type="text"
                    id="positionEn"
                    value={positionEn}
                    onChange={(e) => setPositionEn(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="profileEn">Profile (English)</label>
                  <input
                    type="text"
                    id="profileEn"
                    value={profileEn}
                    onChange={(e) => setProfileEn(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="aboutMeEn">About Me (English)</label>
                  <textarea
                    id="aboutMeEn"
                    value={aboutMeEn}
                    onChange={(e) => setAboutMeEn(e.target.value)}
                  />
                </div>
                <hr className={styles.divider} />
                {/* Новые булевы поля */}
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isPartner}
                      onChange={(e) => setIsPartner(e.target.checked)}
                    />
                    Партнёр
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isManager}
                      onChange={(e) => setIsManager(e.target.checked)}
                    />
                    Менеджер
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    Активный
                  </label>
                </div>
                <button type="submit" className={styles.submitBtn}>Добавить</button>
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