import React, { useState, useEffect } from "react";
import styles from "./admin.module.css";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface MyToken extends JwtPayload {
  userId: string;
  role: string;
}

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
  photoUrl?: string;
}

interface Offer {
  id: number;
  clientName: string;
  reason: string;
  propertyType: string;
  phoneNumber: string;
  createdAt: string;
  status: "PENDING" | "PROCESSED" | "COMPLETED";
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

interface ItemImage {
  id: number;
  url: string;
  order: number;
  isActive: boolean;
}

interface Item {
  id: number;
  title: string;
  images: ItemImage[];
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [images, setImages] = useState<SiteImage[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  // Стани для полів
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [experienceYears, setExperienceYears] = useState<string | undefined>(
    undefined
  );
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
  const [employeePhotoFile, setEmployeePhotoFile] = useState<File | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageToUpdate, setSelectedImageToUpdate] =
    useState<SiteImage | null>(null);

  // Стани для авторизації
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Стани для форми створення адміна
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("admin");

  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: CustomJwtPayload = jwtDecode(token);
        if (
          decoded &&
          decoded.exp !== undefined &&
          decoded.exp * 1000 > Date.now()
        ) {
          setIsLoggedIn(true);
          setUserRole(decoded.role);
          setActiveTab("employees");
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        localStorage.removeItem("token");
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
          fetchItemsForAdmin();
          break;
        case "admins":
          if (userRole === "superadmin") {
            fetchAdmins();
          }
          break;
      }
    }
  }, [activeTab, isLoggedIn, userRole]);

  useEffect(() => {
    if (selectedItem) {
      fetchItemImages(selectedItem.id);
    }
  }, [selectedItem?.id]);

  const getHeadersWithAuth = (isMultipart = false) => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    if (!isMultipart) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${backendUrl}/employee`, {
        headers: getHeadersWithAuth(),
      });
      if (response.ok) {
        const data: Employee[] = await response.json();
        setEmployees(data);
      } else {
        setError("Не вдалося отримати список працівників.");
      }
    } catch (err) {
      console.error("Помилка мережі:", err);
      setError("Помилка мережі при отриманні даних.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${backendUrl}/offers`, {
        headers: getHeadersWithAuth(),
      });
      if (response.ok) {
        const data: Offer[] = await response.json();
        setOffers(data);
      } else {
        setError("Не вдалося отримати список заявок.");
      }
    } catch (err) {
      console.error("Помилка мережі:", err);
      setError("Помилка мережі при отриманні даних.");
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${backendUrl}/images`, {
        headers: getHeadersWithAuth(),
      });
      if (response.ok) {
        const data: SiteImage[] = await response.json();
        setImages(data);
      } else {
        setError("Не вдалося отримати список зображень.");
      }
    } catch (err) {
      console.error("Помилка мережі:", err);
      setError("Помилка мережі при отриманні даних.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      alert("Будь ласка, оберіть файл для завантаження.");
      return;
    }
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Токен не знайдено.");
      const backendUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${backendUrl}/images/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        alert("Зображення успішно завантажено!");
        setFile(null);
        await fetchImages();
      } else {
        const errorData = await response.json();
        setError(`Помилка під час завантаження: ${errorData.message}`);
        alert(`Помилка під час завантаження: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Помилка мережі:", err);
      setError("Помилка мережі під час завантаження файлу.");
      alert("Помилка мережі під час завантаження файлу.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !selectedImageToUpdate) {
      alert("Будь ласка, оберіть файл для оновлення.");
      return;
    }
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Токен не знайдено.");
      const backendUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(
        `${backendUrl}/images/${selectedImageToUpdate.id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Зображення успішно оновлено!");
        setSelectedImageToUpdate(null);
        setFile(null);
        await fetchImages();
      } else {
        const errorData = await response.json();
        setError(`Помилка під час оновлення: ${errorData.message}`);
        alert(`Помилка під час оновлення: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Помилка мережі:", err);
      setError("Помилка мережі під час оновлення файлу.");
      alert("Помилка мережі під час оновлення файлу.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (imageId: number) => {
    const confirmation = window.confirm(
      "Ви впевнені, що хочете видалити це зображення? Ця дія є незворотною."
    );
    if (!confirmation) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Токен не знайдено.");
      const backendUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${backendUrl}/images/${imageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Зображення успішно видалено!");
        await fetchImages();
      } else {
        const errorData = await response.json();
        alert(`Помилка під час видалення: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Помилка мережі:", error);
      alert("Помилка мережі під час видалення зображення.");
    }
  };

  const handleUpdateStatus = async (
    offerId: number,
    newStatus: Offer["status"]
  ) => {
    const confirmation = window.confirm(
      `Ви впевнені, що хочете змінити статус заявки на "${newStatus}"?`
    );
    if (!confirmation) {
      return;
    }

    try {
      const backendUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${backendUrl}/offers/${offerId}/status`, {
        method: "PATCH",
        headers: getHeadersWithAuth(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert("Статус заявки успішно змінено!");
        fetchOffers();
      } else {
        const errorData = await response.json();
        alert(`Помилка під час зміни статусу: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Помилка мережі:", error);
      alert("Помилка мережі під час зміни статусу.");
    }
  };

  const handleCreateEmployee = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      // Додаємо файл, якщо він є
      if (employeePhotoFile) {
        formData.append("file", employeePhotoFile);
      }
      // Додаємо решту даних
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("position", position);
      if (experienceYears !== undefined)
        formData.append("experienceYears", experienceYears);
      formData.append("profile", profile);
      formData.append("aboutMe", aboutMe);
      formData.append("firstNameEn", firstNameEn);
      formData.append("lastNameEn", lastNameEn);
      formData.append("positionEn", positionEn);
      formData.append("profileEn", profileEn);
      formData.append("aboutMeEn", aboutMeEn);
      formData.append("isPARTNER", String(isPartner));
      formData.append("isMANAGER", String(isManager));
      formData.append("isACTIVE", String(isActive));

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Токен не знайдено.");
      const backendUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${backendUrl}/employee/create`, {
        method: "POST",
        // Заголовок 'Content-Type' не потрібен для FormData, браузер сам його встановлює
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Працівника успішно додано!");
        fetchEmployees();
        // Скидаємо всі стани форми
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
        setIsPartner(false);
        setIsManager(false);
        setIsActive(false);
        setEmployeePhotoFile(null);
        setIsFormVisible(false);
      } else {
        const errorData = await response.json();
        alert(`Помилка під час додавання працівника: ${errorData.message}`);
      }
    } catch (err: unknown) {
      console.error("Помилка:", err);
      let errorMessage = "Сталася невідома помилка.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      alert(`Помилка: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId: number) => {
    const confirmation = window.confirm(
      "Ви впевнені, що хочете видалити цього працівника?"
    );
    if (!confirmation) {
      return;
    }
    try {
      const backendUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${backendUrl}/employee/${employeeId}`, {
        method: "DELETE",
        headers: getHeadersWithAuth(),
      });
      if (response.ok) {
        alert("Працівника успішно видалено!");
        fetchEmployees();
      } else {
        alert("Помилка під час видалення працівника.");
      }
    } catch (error) {
      console.error("Помилка мережі:", error);
      alert("Помилка під час видалення даних.");
    }
  };

  const getStatusLabel = (status: Offer["status"]) => {
    switch (status) {
      case "PENDING":
        return "Не розглянуто";
      case "PROCESSED":
        return "Опрацьовано";
      case "COMPLETED":
        return "Завершено";
      default:
        return status;
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const backendUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${backendUrl}/admin/auth/login`, {
        method: "POST",
        headers: getHeadersWithAuth(),
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        const decoded: CustomJwtPayload = jwtDecode(data.token);

        setIsLoggedIn(true);
        setUserRole(decoded.role);
        alert("Авторизація успішна!");
      } else {
        const errorData = await response.json();
        setAuthError(errorData.message || "Помилка авторизації");
      }
    } catch (err: unknown) {
      let errorMessage = "Помилка мережі під час авторизації.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setAuthError(errorMessage);
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
      const backendUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${backendUrl}/admin/admins`, {
        headers: getHeadersWithAuth(),
      });
      if (response.ok) {
        const data: Admin[] = await response.json();
        setAdmins(data);
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || "Не вдалося отримати список адміністраторів."
        );
      }
    } catch (err: unknown) {
      console.error("Помилка мережі:", err);
      let errorMessage = "Помилка мережі при отриманні списку адміністраторів.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const backendUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${backendUrl}/admin/create`, {
        method: "POST",
        headers: getHeadersWithAuth(),
        body: JSON.stringify({
          username: newAdminUsername,
          password: newAdminPassword,
          role: newAdminRole,
        }),
      });

      if (response.ok) {
        alert("Адміністратора успішно створено!");
        setNewAdminUsername("");
        setNewAdminPassword("");
        setNewAdminRole("admin");
        fetchAdmins();
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || "Помилка під час створення адміністратора."
        );
        alert(errorData.message || "Помилка під час створення адміністратора.");
      }
    } catch (err) {
      console.error("Помилка мережі:", err);
      setError("Помилка мережі під час створення адміністратора.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.adminContainer}>
        <h1 className={styles.adminTitle}>Вхід до адмін-панелі</h1>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label>Ім'я користувача:</label>
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
            {loading ? "Вхід..." : "Увійти"}
          </button>
          {authError && <p className={styles.errorMessage}>{authError}</p>}
        </form>
      </div>
    );
  }

  // ... існуючі функції

const fetchItemsForAdmin = async () => {
  setLoading(true);
  setError(null);
  try {
    const backendUrl = process.env.REACT_APP_API_URL;
    const response = await fetch(`${backendUrl}/items/admin`, {
      headers: getHeadersWithAuth(),
    });
    if (response.ok) {
      const data = await response.json();
      setItems(data);
    } else {
      setError("Не вдалося отримати список об'єктів.");
    }
  } catch (err) {
    console.error("Помилка мережі:", err);
    setError("Помилка мережі при отриманні списку об'єктів.");
  } finally {
    setLoading(false);
  }
};

const fetchItemImages = async (itemId: number) => {
  setLoading(true);
  setError(null);
  try {
    const backendUrl = process.env.REACT_APP_API_URL;
    const response = await fetch(`${backendUrl}/images/item/${itemId}`, {
      headers: getHeadersWithAuth(),
    });
    if (response.ok) {
      const data = await response.json();
      setSelectedItem(prevItem => prevItem ? { ...prevItem, images: data } : null);
    } else {
      setError("Не вдалося отримати зображення об'єкта.");
    }
  } catch (err) {
    console.error("Помилка мережі:", err);
    setError("Помилка мережі при отриманні зображень об'єкта.");
  } finally {
    setLoading(false);
  }
};

const handleToggleImageActive = async (imageId: number, currentStatus: boolean) => {
  try {
    const backendUrl = process.env.REACT_APP_API_URL;
    const response = await fetch(`${backendUrl}/images/item/${imageId}/active`, {
      method: 'PUT', // Изменено с PATCH на PUT
      headers: getHeadersWithAuth(),
      body: JSON.stringify({ isActive: !currentStatus }),
    });
    if (response.ok) {
      alert("Статус зображення успішно змінено.");
      if (selectedItem) {
        fetchItemImages(selectedItem.id);
      }
    } else {
      const errorData = await response.json();
      alert(`Помилка під час зміни статусу: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Помилка мережі:", error);
    alert("Помилка мережі під час зміни статусу зображення.");
  }
};

const onDragEnd = async (result: DropResult) => {
  if (!result.destination || !selectedItem) {
    return;
  }

  const newImages = Array.from(selectedItem.images);
  const [reorderedItem] = newImages.splice(result.source.index, 1);
  newImages.splice(result.destination.index, 0, reorderedItem);

  setSelectedItem({ ...selectedItem, images: newImages });

  // Формируем новый массив объектов, как ожидает бэкенд
  const updates = newImages.map((image, index) => ({
    id: image.id,
    order: index,
  }));

  try {
    const backendUrl = process.env.REACT_APP_API_URL;
    const response = await fetch(`${backendUrl}/images/item/order`, {
      method: 'PUT',
      headers: getHeadersWithAuth(),
      body: JSON.stringify({ updates }), // Отправляем массив объектов
    });

    if (response.ok) {
      console.log("Порядок изображений успешно обновлен.");
    } else {
      const errorData = await response.json();
      console.error(`Помилка оновлення порядку: ${errorData.message}`);
      alert(`Помилка оновлення порядку: ${errorData.message}`);
      fetchItemImages(selectedItem.id);
    }
  } catch (error) {
    console.error("Помилка мережі:", error);
    alert("Помилка мережі при оновленні порядку зображень.");
    fetchItemImages(selectedItem.id);
  }
};

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Адмін-панель</h1>
      <button onClick={handleLogout} className={styles.logoutBtn}>
        Вийти
      </button>
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "employees" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("employees")}
        >
          Працівники
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "offers" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("offers")}
        >
          Заявки
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "images" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("images")}
        >
          Зображення
        </button>
        {userRole === "superadmin" && (
          <button
            className={`${styles.tabButton} ${
              activeTab === "admins" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("admins")}
          >
            Адміни
          </button>
        )}
      </div>

      <div className={styles.tabContent}>
        {activeTab === "employees" && (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Працівники</h2>
              <button
                className={styles.toggleButton}
                onClick={() => setIsFormVisible(!isFormVisible)}
              >
                {isFormVisible ? "Приховати форму" : "Додати нового працівника"}
              </button>
            </div>

            {isFormVisible && (
              <form
                onSubmit={handleCreateEmployee}
                className={styles.employeeForm}
              >
                <div className={styles.formGroup}>
                  <label>Фото:</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setEmployeePhotoFile(
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Ім'я (укр):</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Прізвище (укр):</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Посада (укр):</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Досвід (роки):</label>
                  <input
                    type="number"
                    value={experienceYears || ""}
                    onChange={(e) => setExperienceYears(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Профіль (укр):</label>
                  <input
                    type="text"
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Про себе (укр):</label>
                  <textarea
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Ім'я (англ):</label>
                  <input
                    type="text"
                    value={firstNameEn}
                    onChange={(e) => setFirstNameEn(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Прізвище (англ):</label>
                  <input
                    type="text"
                    value={lastNameEn}
                    onChange={(e) => setLastNameEn(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Посада (англ):</label>
                  <input
                    type="text"
                    value={positionEn}
                    onChange={(e) => setPositionEn(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Профіль (англ):</label>
                  <input
                    type="text"
                    value={profileEn}
                    onChange={(e) => setProfileEn(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Про себе (англ):</label>
                  <textarea
                    value={aboutMeEn}
                    onChange={(e) => setAboutMeEn(e.target.value)}
                  />
                </div>
                <div className={styles.checkboxGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isPartner}
                      onChange={(e) => setIsPartner(e.target.checked)}
                    />{" "}
                    Партнер
                  </label>
                </div>
                <div className={styles.checkboxGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isManager}
                      onChange={(e) => setIsManager(e.target.checked)}
                    />{" "}
                    Менеджер
                  </label>
                </div>
                <div className={styles.checkboxGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />{" "}
                    Активний
                  </label>
                </div>
                <button type="submit" className={styles.submitBtn}>
                  Додати працівника
                </button>
              </form>
            )}

            <hr className={styles.divider} />

            <h2 className={styles.sectionTitle}>Список працівників</h2>
            {loading && <p>Завантаження...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            {!loading && !error && employees.length > 0 && (
              <div className={styles.employeeList}>
                {employees.map((employee) => (
                  <div key={employee.id} className={styles.employeeCard}>
                    {employee.photoUrl && (
                      <img
                        src={employee.photoUrl}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className={styles.employeePhoto}
                      />
                    )}
                    <div className={styles.employeeCardContent}>
                      <div>
                        <p>
                          <strong>
                            {employee.firstName} {employee.lastName}
                          </strong>{" "}
                          {employee.isPARTNER && (
                            <span className={styles.statusTag}> (Партнер)</span>
                          )}{" "}
                          {employee.isMANAGER && (
                            <span className={styles.statusTag}>
                              {" "}
                              (Менеджер)
                            </span>
                          )}{" "}
                          {employee.isACTIVE && (
                            <span className={styles.statusTag}>
                              {" "}
                              (Активний)
                            </span>
                          )}
                        </p>
                        <p>Посада: {employee.position}</p>
                        {employee.experienceYears && (
                          <p>Досвід: {employee.experienceYears} років</p>
                        )}
                        {employee.profile && <p>Профіль: {employee.profile}</p>}
                        {employee.aboutMe && (
                          <p>Про себе: {employee.aboutMe}</p>
                        )}
                      </div>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(employee.id)}
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && !error && employees.length === 0 && (
              <p>Список працівників порожній.</p>
            )}
          </div>
        )}
        {activeTab === "offers" && (
          <div className={styles.offersSection}>
            <h2 className={styles.sectionTitle}>Заявки на співпрацю</h2>
            <p>Останні заявки в порядку від нових до старих.</p>
            <hr className={styles.divider} />
            {loading && <p>Завантаження...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            {!loading && !error && offers.length > 0 && (
              <div className={styles.offerList}>
                {offers.map((offer) => (
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
        )}
        {activeTab === "images" && (
          <div>
            <h2 className={styles.sectionTitle}>Керування зображеннями</h2>

            <h3 className={styles.subTitle}>Зображення товарів</h3>
            <div className={styles.itemSelectContainer}>
              <label htmlFor="item-select">Виберіть об'єкт:</label>
              <select
                id="item-select"
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value);
                  const item = items.find(i => i.id === selectedId);
                  setSelectedItem(item || null);
                }}
                value={selectedItem?.id || ''}
              >
                <option value="">-- Виберіть об'єкт --</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} (ID: {item.id})
                  </option>
                ))}
              </select>
            </div>

            {selectedItem && (
              <div className={styles.itemImagesSection}>
                <h4 className={styles.sectionTitle}>Зображення для "{selectedItem.title}"</h4>
                <p>Перетягніть зображення, щоб змінити порядок. Клікніть, щоб змінити видимість.</p>
                {loading && <p>Завантаження зображень...</p>}
                {error && <p className={styles.errorMessage}>{error}</p>}
                
                {!loading && !error && selectedItem.images && selectedItem.images.length > 0 ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="images-droppable" direction="horizontal">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={styles.itemImageList}
                      >
                        {selectedItem.images.map((image, index) => (
                        <Draggable key={image.id} draggableId={String(image.id)} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: image.isActive ? 1 : 0.5,
                              }}
                              className={styles.itemImageCard}
                            >
                              {/* Этот div будет "ручкой" для перетаскивания */}
                              <div {...provided.dragHandleProps} className={styles.dragHandle}>
                                <img
                                  src={image.url}
                                  className={styles.itemImagePreview}
                                  onClick={() => handleToggleImageActive(image.id, image.isActive)}
                                />
                              </div>
                              <div className={styles.imageOverlay}>
                                {image.isActive ? "Активне" : "Неактивне"}
                              </div>
                            </div>
                          )}
                        </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                ) : (
                  <p>Цей об'єкт не має зображень.</p>
                )}
              </div>
            )}
            
            <hr className={styles.divider} />

            <h3 className={styles.subTitle}>Зображення сайту (існуючі)</h3>
            <div className={styles.formGroup}>
              <form onSubmit={handleImageUpload} className={styles.imageForm}>
                <input
                  type="file"
                  onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                  }
                  required
                />
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={uploading}
                >
                  {uploading ? "Завантаження..." : "Завантажити зображення"}
                </button>
              </form>
            </div>
            
            <hr className={styles.divider} />

            <h2 className={styles.sectionTitle}>
              Список завантажених зображень
            </h2>
            {loading && <p>Завантаження...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            {!loading && !error && images.length > 0 && (
              <div className={styles.imageList}>
                {images.map((image) => (
                  <div key={image.id} className={styles.imageCard}>
                    <img
                      src={image.url}
                      alt={image.name}
                      className={styles.imagePreview}
                    />
                    <div className={styles.imageInfo}>
                      <p>
                        <strong>Назва:</strong> {image.name}
                      </p>
                      <p>
                        <strong>URL:</strong>{" "}
                        <a
                          href={image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {image.url}
                        </a>
                      </p>
                      <div className={styles.imageActions}>
                        <button
                          className={styles.updateBtn}
                          onClick={() => setSelectedImageToUpdate(image)}
                        >
                          Оновити
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleImageDelete(image.id)}
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && !error && images.length === 0 && (
              <p>Список зображень порожній. Завантажте перше зображення.</p>
            )}
          </div>
        )}
        {selectedImageToUpdate && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Оновити зображення: {selectedImageToUpdate.name}</h3>
              <p>Виберіть новий файл для заміни поточного.</p>
              <form onSubmit={handleUpdate}>
                <input
                  type="file"
                  onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                  }
                  required
                />
                <div className={styles.modalActions}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={uploading}
                  >
                    {uploading ? "Оновлення..." : "Оновити"}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => {
                      setSelectedImageToUpdate(null);
                      setFile(null);
                    }}
                  >
                    Скасувати
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {activeTab === "admins" && userRole === "superadmin" && (
          <div>
            <h2 className={styles.sectionTitle}>Керування адміністраторами</h2>
            <form onSubmit={handleCreateAdmin} className={styles.adminForm}>
              <div className={styles.formGroup}>
                <label>Ім'я користувача:</label>
                <input
                  type="text"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Пароль:</label>
                <input
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Роль:</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                >
                  <option value="admin">Адмін</option>
                  <option value="superadmin">Суперадмін</option>
                </select>
              </div>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Створення..." : "Створити адміна"}
              </button>
            </form>

            <hr className={styles.divider} />

            <h2 className={styles.sectionTitle}>Список адміністраторів</h2>
            {loading && <p>Завантаження...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            {!loading && !error && admins.length > 0 && (
              <div className={styles.adminList}>
                {admins.map((admin) => (
                  <div key={admin.id} className={styles.adminCard}>
                    <p>
                      <strong>ID:</strong> {admin.id}
                    </p>
                    <p>
                      <strong>Ім'я користувача:</strong> {admin.username}
                    </p>
                    <p>
                      <strong>Роль:</strong> {admin.role}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {!loading && !error && admins.length === 0 && (
              <p>Список адміністраторів порожній.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
