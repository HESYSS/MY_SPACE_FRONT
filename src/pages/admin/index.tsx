import React, { useState, useEffect } from "react";
import styles from './admin.module.css';
import { jwtDecode, JwtPayload } from 'jwt-decode';

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

interface Offer {
  id: number;
  clientName: string;
  reason: string;
  propertyType: string;
  phoneNumber: string;
  createdAt: string;
  status: 'PENDING' | 'PROCESSED' | 'COMPLETED';
}

interface SiteImage {
  id: number;
  name: string;
  url: string;
}

interface Admin {
  id: number;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomJwtPayload extends JwtPayload {
  id: number;
  role: string;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [images, setImages] = useState<SiteImage[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  
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

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageToUpdate, setSelectedImageToUpdate] = useState<SiteImage | null>(null);

  // Состояния для авторизации
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Состояния для формы создания админа
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('admin');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: CustomJwtPayload = jwtDecode(token);
        if (decoded && decoded.exp !== undefined && decoded.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
          setUserRole(decoded.role);
          setActiveTab("employees");
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      switch (activeTab) {
        case "employees":
          fetchEmployees();
          break;
        case "offers":
          fetchOffers();
          break;
        case "images":
          fetchImages();
          break;
        case "admins":
          if (userRole === 'superadmin') {
            fetchAdmins();
          }
          break;
      }
    }
  }, [activeTab, isLoggedIn, userRole]);

  const getHeadersWithAuth = () => {
    const token = localStorage.getItem('token');
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/employee", {
        headers: getHeadersWithAuth(),
      });
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
      const response = await fetch("http://localhost:3001/offers", {
        headers: getHeadersWithAuth(),
      });
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
  
  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/images", {
        headers: getHeadersWithAuth(),
      });
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
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Токен не найден.");
      const response = await fetch("http://localhost:3001/images/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        alert("Изображение успешно загружено!");
        setFile(null);
        await fetchImages();
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
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Токен не найден.");
      const response = await fetch(`http://localhost:3001/images/${selectedImageToUpdate.id}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` },
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

  const handleImageDelete = async (imageId: number) => {
    const confirmation = window.confirm("Вы уверены, что хотите удалить это изображение? Это действие необратимо.");
    if (!confirmation) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Токен не найден.");
      const response = await fetch(`http://localhost:3001/images/${imageId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Изображение успешно удалено!");
        await fetchImages();
      } else {
        const errorData = await response.json();
        alert(`Ошибка при удалении: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      alert("Ошибка сети при удалении изображения.");
    }
  };

  const handleUpdateStatus = async (offerId: number, newStatus: Offer['status']) => {
    const confirmation = window.confirm(`Вы уверены, что хотите изменить статус оффера на "${newStatus}"?`);
    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/offers/${offerId}/status`, {
        method: "PATCH",
        headers: getHeadersWithAuth(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert("Статус оффера успешно изменен!");
        fetchOffers();
      } else {
        const errorData = await response.json();
        alert(`Ошибка при изменении статуса: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      alert("Ошибка сети при изменении статуса.");
    }
  };

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
        method: "POST",
        headers: getHeadersWithAuth(),
        body: JSON.stringify(employeeData),
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
      const response = await fetch(`http://localhost:3001/employee/${employeeId}`, {
        method: "DELETE",
        headers: getHeadersWithAuth(),
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
  
  const getStatusLabel = (status: Offer['status']) => {
    switch(status) {
      case 'PENDING': return 'Не рассмотрен';
      case 'PROCESSED': return 'Обработан';
      case 'COMPLETED': return 'Завершен';
      default: return status;
    }
  };

  // Новые функции для авторизации и управления админами
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const response = await fetch("http://localhost:3001/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        const decoded: CustomJwtPayload = jwtDecode(data.token);
        
        console.log("Декодированный токен:", decoded);
        
        setIsLoggedIn(true);
        setUserRole(decoded.role);
        alert("Авторизация успешна!");
      } else {
        const errorData = await response.json();
        setAuthError(errorData.message || "Ошибка авторизации");
      }
    } catch (err) {
      setAuthError("Ошибка сети при авторизации.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole(null);
    setActiveTab("employees");
    setUsername("");
    setPassword("");
    setAuthError(null);
  };

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/admin/admins", {
        headers: getHeadersWithAuth(),
      });
      if (response.ok) {
        const data: Admin[] = await response.json();
        setAdmins(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Не удалось получить список админов.");
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      setError("Ошибка сети при получении списка админов.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/admin/create", {
        method: "POST",
        headers: getHeadersWithAuth(),
        body: JSON.stringify({
          username: newAdminUsername,
          password: newAdminPassword,
          role: newAdminRole,
        }),
      });

      if (response.ok) {
        alert("Администратор успешно создан!");
        setNewAdminUsername('');
        setNewAdminPassword('');
        setNewAdminRole('admin');
        fetchAdmins();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Ошибка при создании админа.");
        alert(errorData.message || "Ошибка при создании админа.");
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      setError("Ошибка сети при создании админа.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.adminContainer}>
        <h1 className={styles.adminTitle}>Вход в админ-панель</h1>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label>Имя пользователя:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </button>
          {authError && <p className={styles.errorMessage}>{authError}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Админ-панель</h1>
      <button onClick={handleLogout} className={styles.logoutBtn}>Выйти</button>
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
        {userRole === "superadmin" && (
          <button
            className={`${styles.tabButton} ${activeTab === "admins" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("admins")}
          >
            Админы
          </button>
        )}
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
                <div className={styles.formGroup}><label>Имя (рус):</label><input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /></div>
                <div className={styles.formGroup}><label>Фамилия (рус):</label><input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required /></div>
                <div className={styles.formGroup}><label>Должность (рус):</label><input type="text" value={position} onChange={(e) => setPosition(e.target.value)} required /></div>
                <div className={styles.formGroup}><label>Опыт (лет):</label><input type="number" value={experienceYears || ''} onChange={(e) => setExperienceYears(e.target.value)} /></div>
                <div className={styles.formGroup}><label>Профиль (рус):</label><input type="text" value={profile} onChange={(e) => setProfile(e.target.value)} /></div>
                <div className={styles.formGroup}><label>О себе (рус):</label><textarea value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} /></div>
                <div className={styles.formGroup}><label>Имя (англ):</label><input type="text" value={firstNameEn} onChange={(e) => setFirstNameEn(e.target.value)} /></div>
                <div className={styles.formGroup}><label>Фамилия (англ):</label><input type="text" value={lastNameEn} onChange={(e) => setLastNameEn(e.target.value)} /></div>
                <div className={styles.formGroup}><label>Должность (англ):</label><input type="text" value={positionEn} onChange={(e) => setPositionEn(e.target.value)} /></div>
                <div className={styles.formGroup}><label>Профиль (англ):</label><input type="text" value={profileEn} onChange={(e) => setProfileEn(e.target.value)} /></div>
                <div className={styles.formGroup}><label>О себе (англ):</label><textarea value={aboutMeEn} onChange={(e) => setAboutMeEn(e.target.value)} /></div>
                <div className={styles.checkboxGroup}><label><input type="checkbox" checked={isPartner} onChange={(e) => setIsPartner(e.target.checked)} /> Партнер</label></div>
                <div className={styles.checkboxGroup}><label><input type="checkbox" checked={isManager} onChange={(e) => setIsManager(e.target.checked)} /> Менеджер</label></div>
                <div className={styles.checkboxGroup}><label><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Активный</label></div>
                <button type="submit" className={styles.submitBtn}>Добавить работника</button>
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
                        <p><strong>{employee.firstName} {employee.lastName}</strong> {employee.isPARTNER && <span className={styles.statusTag}> (Партнёр)</span>} {employee.isMANAGER && <span className={styles.statusTag}> (Менеджер)</span>} {employee.isACTIVE && <span className={styles.statusTag}> (Активный)</span>}</p>
                        <p>Должность: {employee.position}</p>
                        {employee.experienceYears && <p>Опыт: {employee.experienceYears} лет</p>}
                        {employee.profile && <p>Профиль: {employee.profile}</p>}
                        {employee.aboutMe && <p>О себе: {employee.aboutMe}</p>}
                      </div>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(employee.id)}>Удалить</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && !error && employees.length === 0 && (<p>Список работников пуст.</p>)}
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
                        <button className={styles.statusBtn} onClick={() => handleUpdateStatus(offer.id, 'PENDING')} disabled={offer.status === 'PENDING'}>Не рассмотрен</button>
                        <button className={styles.statusBtn} onClick={() => handleUpdateStatus(offer.id, 'PROCESSED')} disabled={offer.status === 'PROCESSED'}>Обработан</button>
                        <button className={styles.statusBtn} onClick={() => handleUpdateStatus(offer.id, 'COMPLETED')} disabled={offer.status === 'COMPLETED'}>Завершен</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && !error && offers.length === 0 && (<p>Список офферов пуст.</p>)}
          </div>
        )}
        {activeTab === "images" && (
          <div>
            <h2 className={styles.sectionTitle}>Управление изображениями</h2>
            <div className={styles.formGroup}>
              <form onSubmit={handleImageUpload} className={styles.imageForm}>
                <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} required />
                <button type="submit" className={styles.submitBtn} disabled={uploading}>{uploading ? "Загрузка..." : "Загрузить изображение"}</button>
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
                        <button className={styles.updateBtn} onClick={() => setSelectedImageToUpdate(image)}>Обновить</button>
                        <button className={styles.deleteBtn} onClick={() => handleImageDelete(image.id)}>Удалить</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && !error && images.length === 0 && (<p>Список изображений пуст. Загрузите первое изображение.</p>)}
          </div>
        )}
        {selectedImageToUpdate && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Обновить изображение: {selectedImageToUpdate.name}</h3>
              <p>Выберите новый файл для замены текущего.</p>
              <form onSubmit={handleUpdate}>
                <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} required />
                <div className={styles.modalActions}>
                  <button type="submit" className={styles.submitBtn} disabled={uploading}>{uploading ? "Обновление..." : "Обновить"}</button>
                  <button type="button" className={styles.cancelBtn} onClick={() => { setSelectedImageToUpdate(null); setFile(null); }}>Отмена</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {activeTab === "admins" && userRole === "superadmin" && (
          <div>
            <h2 className={styles.sectionTitle}>Управление администраторами</h2>
            <form onSubmit={handleCreateAdmin} className={styles.adminForm}>
              <div className={styles.formGroup}>
                <label>Имя пользователя:</label>
                <input type="text" value={newAdminUsername} onChange={(e) => setNewAdminUsername(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label>Пароль:</label>
                <input type="password" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label>Роль:</label>
                <select value={newAdminRole} onChange={(e) => setNewAdminRole(e.target.value)}>
                  <option value="admin">Админ</option>
                  <option value="superadmin">Суперадмин</option>
                </select>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? "Создание..." : "Создать админа"}</button>
            </form>
            
            <hr className={styles.divider} />
            
            <h2 className={styles.sectionTitle}>Список администраторов</h2>
            {loading && <p>Загрузка...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            {!loading && !error && admins.length > 0 && (
              <div className={styles.adminList}>
                {admins.map((admin) => (
                  <div key={admin.id} className={styles.adminCard}>
                    <p><strong>ID:</strong> {admin.id}</p>
                    <p><strong>Имя пользователя:</strong> {admin.username}</p>
                    <p><strong>Роль:</strong> {admin.role}</p>
                  </div>
                ))}
              </div>
            )}
            {!loading && !error && admins.length === 0 && (<p>Список админов пуст.</p>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;