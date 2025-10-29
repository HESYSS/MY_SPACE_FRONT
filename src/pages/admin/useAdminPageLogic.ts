// src/pages/admin/useAdminPageLogic.ts

import { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { DropResult } from "@hello-pangea/dnd";
import { Offer, Employee, Admin, Item, SiteImage } from './types/interface'; 
// Предполагаем, что интерфейсы Offer, Employee, Admin, Item, SiteImage доступны по этому пути

// -------------------------------------------------------------
// ТИПИЗАЦИЯ
// -------------------------------------------------------------

interface CustomJwtPayload extends JwtPayload {
  id: number;
  role: string;
}

interface UserAuthType {
  role: string;
  username: string;
}

// -------------------------------------------------------------
// ТИП ДЛЯ ВОЗВРАЩАЕМОГО ЗНАЧЕНИЯ ХУКА
// -------------------------------------------------------------

interface AdminPageLogic {
    // Состояния
    activeTab: string; setActiveTab: Dispatch<SetStateAction<string>>;
    isFormVisible: boolean; setIsFormVisible: Dispatch<SetStateAction<boolean>>;
    isFormVisibleAdmins: boolean; setIsFormVisibleAdmins: Dispatch<SetStateAction<boolean>>;
    employees: Employee[]; setEmployees: Dispatch<SetStateAction<Employee[]>>;
    offers: Offer[]; setOffers: Dispatch<SetStateAction<Offer[]>>;
    images: SiteImage[]; setImages: Dispatch<SetStateAction<SiteImage[]>>;
    admins: Admin[]; setAdmins: Dispatch<SetStateAction<Admin[]>>;
    loading: boolean; setLoading: Dispatch<SetStateAction<boolean>>;
    error: string | null; setError: Dispatch<SetStateAction<string | null>>;
    uploading: boolean; setUploading: Dispatch<SetStateAction<boolean>>;
    selectedImageToUpdate: SiteImage | null; setSelectedImageToUpdate: Dispatch<SetStateAction<SiteImage | null>>;
    isLoggedIn: boolean; setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
    username: string; setUsername: Dispatch<SetStateAction<string>>;
    password: string; setPassword: Dispatch<SetStateAction<string>>;
    authError: string | null; setAuthError: Dispatch<SetStateAction<string | null>>;
    userRole: string | null; setUserRole: Dispatch<SetStateAction<string | null>>;
    userAuthInfo: UserAuthType | null; setUserAuthInfo: Dispatch<SetStateAction<UserAuthType | null>>;
    file: File | null; setFile: Dispatch<SetStateAction<File | null>>;

    // Состояния формы сотрудников
    firstName: string; setFirstName: Dispatch<SetStateAction<string>>;
    lastName: string; setLastName: Dispatch<SetStateAction<string>>;
    position: string; setPosition: Dispatch<SetStateAction<string>>;
    experienceYears: string | undefined; setExperienceYears: Dispatch<SetStateAction<string | undefined>>;
    profile: string; setProfile: Dispatch<SetStateAction<string>>;
    aboutMe: string; setAboutMe: Dispatch<SetStateAction<string>>;
    firstNameEn: string; setFirstNameEn: Dispatch<SetStateAction<string>>;
    lastNameEn: string; setLastNameEn: Dispatch<SetStateAction<string>>;
    positionEn: string; setPositionEn: Dispatch<SetStateAction<string>>;
    profileEn: string; setProfileEn: Dispatch<SetStateAction<string>>;
    aboutMeEn: string; setAboutMeEn: Dispatch<SetStateAction<string>>;
    isPartner: boolean; setIsPartner: Dispatch<SetStateAction<boolean>>;
    isManager: boolean; setIsManager: Dispatch<SetStateAction<boolean>>;
    isSupervisor: boolean; setIsSupervisor: Dispatch<SetStateAction<boolean>>;
    isActive: boolean; setIsActive: Dispatch<SetStateAction<boolean>>;
    employeePhotoFile: File | null; setEmployeePhotoFile: Dispatch<SetStateAction<File | null>>;
    
    // Состояния формы админов
    newAdminUsername: string; setNewAdminUsername: Dispatch<SetStateAction<string>>;
    newAdminPassword: string; setNewAdminPassword: Dispatch<SetStateAction<string>>;
    newAdminRole: string; setNewAdminRole: Dispatch<SetStateAction<string>>;

    // Состояния Items/Images
    items: Item[]; setItems: Dispatch<SetStateAction<Item[]>>;
    selectedItem: Item | null; setSelectedItem: Dispatch<SetStateAction<Item | null>>;

    // Функции
    getHeadersWithAuth: (isMultipart?: boolean) => HeadersInit;
    fetchEmployees: () => Promise<void>;
    fetchOffers: () => Promise<void>;
    fetchImages: () => Promise<void>;
    fetchAdmins: () => Promise<void>;
    fetchItemsForAdmin: () => Promise<void>;
    fetchItemImages: (itemId: number) => Promise<void>;
    handleImageUpload: (event: React.FormEvent) => Promise<void>;
    handleUpdate: (event: React.FormEvent) => Promise<void>;
    handleImageDelete: (imageId: number) => Promise<void>;
    handleUpdateStatus: (offerId: number, newStatus: Offer["status"]) => Promise<void>;
    getStatusLabel: (status: Offer["status"]) => string;
    handleCreateEmployee: (event: React.FormEvent) => Promise<void>;
    handleDelete: (employeeId: number) => Promise<void>;
    handleLogin: (event: React.FormEvent) => Promise<void>;
    handleLogout: () => void;
    handleCreateAdmin: (event: React.FormEvent) => Promise<void>;
    handleDeleteAdmin: (adminId: number) => Promise<void>;
    handleUpdateRole: (adminId: number, newRole: string) => Promise<void>;
    handleToggleImageActive: (imageId: number, currentStatus: boolean) => Promise<void>;
    onDragEnd: (result: DropResult) => Promise<void>;
}

// -------------------------------------------------------------
// ГЛАВНЫЙ ХУК
// -------------------------------------------------------------

export const useAdminPageLogic = (): AdminPageLogic => {
    // -------------------------------------------------------------
    // СОСТОЯНИЯ
    // -------------------------------------------------------------

    const [activeTab, setActiveTab] = useState("employees");
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isFormVisibleAdmins, setIsFormVisibleAdmins] = useState(false);

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [images, setImages] = useState<SiteImage[]>([]);
    const [admins, setAdmins] = useState<Admin[]>([]);
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
    const [isSupervisor, setIsSupervisor] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [employeePhotoFile, setEmployeePhotoFile] = useState<File | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageToUpdate, setSelectedImageToUpdate] = useState<SiteImage | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null); 
    const [userAuthInfo, setUserAuthInfo] = useState<UserAuthType | null>(null);
    const [newAdminUsername, setNewAdminUsername] = useState("");
    const [newAdminPassword, setNewAdminPassword] = useState("");
    const [newAdminRole, setNewAdminRole] = useState<string>("admin");
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    
    // -------------------------------------------------------------
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // -------------------------------------------------------------

    const getHeadersWithAuth = useCallback((isMultipart = false): HeadersInit => {
        const token = localStorage.getItem("token");
        const headers: HeadersInit = {
            ...(token && { Authorization: `Bearer ${token}` }),
        };
        if (!isMultipart) {
            headers["Content-Type"] = "application/json";
        }
        return headers;
    }, []);

    const getStatusLabel = useCallback((status: Offer["status"]): string => {
        switch (status) {
            case "PENDING": return "Не рассмотрено";
            case "PROCESSED": return "Обработано";
            case "COMPLETED": return "Завершено";
            default: return status;
        }
    }, []);
    
    // -------------------------------------------------------------
    // FETCH ФУНКЦИИ
    // -------------------------------------------------------------

    const fetchEmployees = useCallback(async () => {
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
                setError("Не удалось получить список сотрудников.");
            }
        } catch (err) {
            console.error("Ошибка сети:", err);
            setError("Ошибка сети при получении данных.");
        } finally {
            setLoading(false);
        }
    }, [getHeadersWithAuth]);

    const fetchOffers = useCallback(async () => {
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
                setError("Не удалось получить список заявок.");
            }
        } catch (err) {
            console.error("Ошибка сети:", err);
            setError("Ошибка сети при получении данных.");
        } finally {
            setLoading(false);
        }
    }, [getHeadersWithAuth]);

    const fetchImages = useCallback(async () => {
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
                setError("Не удалось получить список изображений.");
            }
        } catch (err) {
            console.error("Ошибка сети:", err);
            setError("Ошибка сети при получении данных.");
        } finally {
            setLoading(false);
        }
    }, [getHeadersWithAuth]);

    const fetchAdmins = useCallback(async () => {
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
                setError(errorData.message || "Не удалось получить список администраторов.");
            }
        } catch (err: unknown) {
            console.error("Ошибка сети:", err);
            let errorMessage = "Ошибка сети при получении списка администраторов.";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [getHeadersWithAuth]);

    const fetchItemsForAdmin = useCallback(async () => {
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
                setError("Не удалось получить список объектов.");
            }
        } catch (err) {
            console.error("Ошибка сети:", err);
            setError("Ошибка сети при получении списка объектов.");
        } finally {
            setLoading(false);
        }
    }, [getHeadersWithAuth]);

    const fetchItemImages = useCallback(async (itemId: number) => {
        setLoading(true);
        setError(null);
        try {
            const backendUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${backendUrl}/images/item/${itemId}`, {
                headers: getHeadersWithAuth(),
            });
            if (response.ok) {
                const data = await response.json();
                setSelectedItem((prevItem) =>
                    prevItem ? { ...prevItem, images: data } : null
                );
            } else {
                setError("Не удалось получить изображения объекта.");
            }
        } catch (err) {
            console.error("Ошибка сети:", err);
            setError("Ошибка сети при получении изображений объекта.");
        } finally {
            setLoading(false);
        }
    }, [getHeadersWithAuth]);
    
    // -------------------------------------------------------------
    // ОБРАБОТЧИКИ (HANDLE)
    // -------------------------------------------------------------

    const handleImageUpload = useCallback(async (event: React.FormEvent) => {
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
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Токен не найден.");
            const backendUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${backendUrl}/images/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
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
    }, [file, fetchImages]);

    const handleUpdate = useCallback(async (event: React.FormEvent) => {
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
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Токен не найден.");
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
    }, [file, selectedImageToUpdate, fetchImages]);

    const handleImageDelete = useCallback(async (imageId: number) => {
        const confirmation = window.confirm(
            "Вы уверены, что хотите удалить это изображение? Это действие необратимо."
        );
        if (!confirmation) {
            return;
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Токен не найден.");
            const backendUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${backendUrl}/images/${imageId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
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
    }, [fetchImages]);

    const handleUpdateStatus = useCallback(async (
        offerId: number,
        newStatus: Offer["status"]
    ) => {
        const confirmation = window.confirm(
            `Вы уверены, что хотите изменить статус заявки на "${newStatus}"?`
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
                alert("Статус заявки успешно изменен!");
                fetchOffers();
            } else {
                const errorData = await response.json();
                alert(`Ошибка при смене статуса: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
            alert("Ошибка сети при смене статуса.");
        }
    }, [getHeadersWithAuth, fetchOffers]);
    
    const handleCreateEmployee = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            if (employeePhotoFile) {
                formData.append("file", employeePhotoFile);
            }
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
            formData.append("isSUPERVISOR", String(isSupervisor));
            formData.append("isACTIVE", String(isActive));

            const token = localStorage.getItem("token");
            if (!token) throw new Error("Токен не найден.");
            const backendUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${backendUrl}/employee/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                alert("Сотрудник успешно добавлен!");
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
                setIsPartner(false);
                setIsManager(false);
                setIsActive(false);
                setIsSupervisor(false);
                setEmployeePhotoFile(null);
                setIsFormVisible(false);
            } else {
                const errorData = await response.json();
                alert(`Ошибка при добавлении сотрудника: ${errorData.message}`);
            }
        } catch (err: unknown) {
            console.error("Ошибка:", err);
            let errorMessage = "Произошла неизвестная ошибка.";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            alert(`Ошибка: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }, [employeePhotoFile, firstName, lastName, position, experienceYears, profile, aboutMe, firstNameEn, lastNameEn, positionEn, profileEn, aboutMeEn, isPartner, isManager, isSupervisor, isActive, fetchEmployees]);

    const handleDelete = useCallback(async (employeeId: number) => {
        const confirmation = window.confirm(
            "Вы уверены, что хотите удалить этого сотрудника?"
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
                alert("Сотрудник успешно удален!");
                fetchEmployees();
            } else {
                alert("Ошибка при удалении сотрудника.");
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
            alert("Ошибка при удалении данных.");
        }
    }, [getHeadersWithAuth, fetchEmployees]);
    
    const handleLogin = useCallback(async (event: React.FormEvent) => {
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
                setUserAuthInfo({ role: decoded.role, username: username }); 
                alert("Авторизация успешна!");
            } else {
                const errorData = await response.json();
                setAuthError(errorData.message || "Ошибка авторизации");
            }
        } catch (err: unknown) {
            let errorMessage = "Ошибка сети во время авторизации.";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setAuthError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [getHeadersWithAuth, username, password]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserRole(null);
        setUserAuthInfo(null);
        setActiveTab("employees");
        setUsername("");
        setPassword("");
        setAuthError(null);
    }, []);

    const handleCreateAdmin = useCallback(async (event: React.FormEvent) => {
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
                alert("Администратор успешно создан!");
                setNewAdminUsername("");
                setNewAdminPassword("");
                setNewAdminRole("admin");
                fetchAdmins();
                setIsFormVisibleAdmins(false);
            } else {
                const errorData = await response.json();
                setError(
                    errorData.message || "Ошибка при создании администратора."
                );
                alert(errorData.message || "Ошибка при создании администратора.");
            }
        } catch (err) {
            console.error("Ошибка сети:", err);
            setError("Ошибка сети при создании администратора.");
        } finally {
            setLoading(false);
        }
    }, [getHeadersWithAuth, newAdminUsername, newAdminPassword, newAdminRole, fetchAdmins]);

    const handleDeleteAdmin = useCallback(async (adminId: number) => { 
        const confirmation = window.confirm(
            "Вы уверены, что хотите удалить этого администратора? Это действие необратимо."
        );
        if (!confirmation) return;

        try {
            const backendUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${backendUrl}/admin/admins/${adminId}`, {
                method: "DELETE",
                headers: getHeadersWithAuth(),
            });
            if (response.ok) {
                alert("Администратор успешно удален!");
                fetchAdmins();
            } else {
                alert("Ошибка при удалении администратора.");
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
            alert("Ошибка при удалении данных.");
        }
    }, [getHeadersWithAuth, fetchAdmins]);

    const handleUpdateRole = useCallback(async (adminId: number, newRole: string) => { 
        const confirmation = window.confirm(
            `Вы уверены, что хотите изменить роль администратора на "${newRole}"?`
        );
        if (!confirmation) return;

        try {
            const backendUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${backendUrl}/admin/admins/${adminId}/role`, {
                method: "PATCH",
                headers: getHeadersWithAuth(),
                body: JSON.stringify({ role: newRole }),
            });

            if (response.ok) {
                alert("Роль успешно изменена!");
                fetchAdmins();
            } else {
                const errorData = await response.json();
                alert(`Ошибка при смене роли: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
            alert("Ошибка сети при смене роли.");
        }
    }, [getHeadersWithAuth, fetchAdmins]);

    const handleToggleImageActive = useCallback(async (
        imageId: number,
        currentStatus: boolean
    ) => {
        try {
            const backendUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(
                `${backendUrl}/images/item/${imageId}/active`,
                {
                    method: "PUT",
                    headers: getHeadersWithAuth(),
                    body: JSON.stringify({ isActive: !currentStatus }),
                }
            );
            if (response.ok) {
                alert("Статус изображения успешно изменен.");
                if (selectedItem) {
                    fetchItemImages(selectedItem.id);
                }
            } else {
                const errorData = await response.json();
                alert(`Ошибка при смене статуса: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
            alert("Ошибка сети при смене статуса изображения.");
        }
    }, [getHeadersWithAuth, selectedItem, fetchItemImages]);

    const onDragEnd = useCallback(async (result: DropResult) => {
        if (!result.destination || !selectedItem) {
            return;
        }
        const newImages = Array.from(selectedItem.images);
        const [reorderedItem] = newImages.splice(result.source.index, 1);
        newImages.splice(result.destination.index, 0, reorderedItem);

        setSelectedItem({ ...selectedItem, images: newImages });

        const updates = newImages.map((image, index) => ({
            id: image.id,
            order: index,
        }));

        try {
            const backendUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${backendUrl}/images/item/order`, {
                method: "PUT",
                headers: getHeadersWithAuth(),
                body: JSON.stringify({ updates }),
            });

            if (response.ok) {
            } else {
                const errorData = await response.json();
                console.error(`Ошибка обновления порядка: ${errorData.message}`);
                alert(`Ошибка обновления порядка: ${errorData.message}`);
                fetchItemImages(selectedItem.id);
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
            alert("Ошибка сети при обновлении порядка изображений.");
            fetchItemImages(selectedItem.id);
        }
    }, [getHeadersWithAuth, selectedItem, fetchItemImages]);
    
    // -------------------------------------------------------------
    // useEffects
    // -------------------------------------------------------------

    // 1. Авторизация при загрузке
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
                    setUserAuthInfo({ role: decoded.role, username: decoded.sub || '' }); 
                    setActiveTab("employees");
                } else {
                    localStorage.removeItem("token");
                }
            } catch (err) {
                localStorage.removeItem("token");
            }
        }
    }, []);

    // 2. Загрузка данных при смене вкладки или статуса авторизации
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
    }, [activeTab, isLoggedIn, userRole, fetchEmployees, fetchOffers, fetchImages, fetchAdmins, fetchItemsForAdmin]);

    // 3. Загрузка изображений при выборе объекта
    useEffect(() => {
        if (selectedItem) {
            fetchItemImages(selectedItem.id);
        }
    }, [selectedItem?.id, fetchItemImages]); 
    
    // -------------------------------------------------------------
    // ВОЗВРАТ ЗНАЧЕНИЙ
    // -------------------------------------------------------------

    return {
        activeTab, setActiveTab,
        isFormVisible, setIsFormVisible,
        isFormVisibleAdmins, setIsFormVisibleAdmins,
        employees, setEmployees,
        offers, setOffers,
        images, setImages,
        admins, setAdmins,
        loading, setLoading,
        error, setError,
        uploading, setUploading,
        selectedImageToUpdate, setSelectedImageToUpdate,
        isLoggedIn, setIsLoggedIn,
        username, setUsername,
        password, setPassword,
        authError, setAuthError,
        userRole, setUserRole,
        userAuthInfo, setUserAuthInfo,
        file, setFile,

        // Состояния формы сотрудников
        firstName, setFirstName,
        lastName, setLastName,
        position, setPosition,
        experienceYears, setExperienceYears,
        profile, setProfile,
        aboutMe, setAboutMe,
        firstNameEn, setFirstNameEn,
        lastNameEn, setLastNameEn,
        positionEn, setPositionEn,
        profileEn, setProfileEn,
        aboutMeEn, setAboutMeEn,
        isPartner, setIsPartner,
        isManager, setIsManager,
        isSupervisor, setIsSupervisor,
        isActive, setIsActive,
        employeePhotoFile, setEmployeePhotoFile,
        
        // Состояния формы админов
        newAdminUsername, setNewAdminUsername,
        newAdminPassword, setNewAdminPassword,
        newAdminRole, setNewAdminRole,

        // Состояния Items/Images
        items, setItems,
        selectedItem, setSelectedItem,

        // Функции
        getHeadersWithAuth,
        fetchEmployees,
        fetchOffers,
        fetchImages,
        fetchAdmins,
        fetchItemsForAdmin,
        fetchItemImages,
        handleImageUpload,
        handleUpdate,
        handleImageDelete,
        handleUpdateStatus,
        getStatusLabel,
        handleCreateEmployee,
        handleDelete,
        handleLogin,
        handleLogout,
        handleCreateAdmin,
        handleDeleteAdmin,
        handleUpdateRole,
        handleToggleImageActive,
        onDragEnd,
    };
};