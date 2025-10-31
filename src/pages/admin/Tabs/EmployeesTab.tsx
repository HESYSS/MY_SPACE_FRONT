import React, { FC, SetStateAction, Dispatch } from 'react';

// Убедитесь, что вы импортируете тип Employee из вашего места.
// Для целей исправления я оставлю 'any', но помните о необходимости его замены.
// import { Employee } from '../types/interface'; // <--- Раскомментируйте, если это ваш путь

// 1. Створення інтерфейсу для пропсів
interface EmployeesSectionProps {
    styles: Record<string, string>;
    loading: boolean;
    error: string | null;
    employees: any[]; // !!! ЗАМЕНИТЕ 'any' НА ВАШ РЕАЛЬНЫЙ ТИП Employee[] !!!
    isFormVisible: boolean;
    setIsFormVisible: Dispatch<SetStateAction<boolean>>;
    handleCreateEmployee: (e: React.FormEvent) => Promise<void>;
    handleDelete: (employeeId: number) => Promise<void>;

    // 👇 ИСПРАВЛЕННЫЕ И ДОБАВЛЕННЫЕ ПРОПСЫ 👇
    // Имя пропса изменено с 'editingEmployee' на 'selectedEmployee'
    selectedEmployee: any | null; // !!! ЗАМЕНИТЕ 'any' НА ВАШ РЕАЛЬНЫЙ ТИП Employee !!!
    setSelectedEmployee: Dispatch<SetStateAction<any | null>>; // !!! ЗАМЕНИТЕ 'any' НА ВАШ РЕАЛЬНЫЙ ТИП Employee !!!
    handleUpdateEmployee: (e: React.FormEvent) => Promise<void>; // Функция для обновления сотрудника
    handleEditEmployee: (employee: any) => void; // <--- ДОБАВЛЕННЫЙ ПРОПС для заполнения полей
    // ----------------------------------------

    // Стани форми (используются как для создания, так и для редактирования)
    setEmployeePhotoFile: Dispatch<SetStateAction<File | null>>;
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
    isSupervisor: boolean; setIsSupervisor: Dispatch<SetStateAction<boolean>>;
    isPartner: boolean; setIsPartner: Dispatch<SetStateAction<boolean>>;
    isManager: boolean; setIsManager: Dispatch<SetStateAction<boolean>>;
    isActive: boolean; setIsActive: Dispatch<SetStateAction<boolean>>;
}

// 2. Застосування інтерфейсу до компонента
const EmployeesSection: FC<EmployeesSectionProps> = ({ 
    styles, 
    loading, 
    error, 
    employees, 
    isFormVisible, 
    setIsFormVisible, 
    handleCreateEmployee, 
    handleDelete, 
    
    // Пропсы редактирования (переименованы)
    selectedEmployee, // <--- ИСПРАВЛЕНО
    setSelectedEmployee, // <--- ИСПРАВЛЕНО
    handleUpdateEmployee, 
    handleEditEmployee, // <--- ДОБАВЛЕНО
    
    // Стани формы для сотрудника
    setEmployeePhotoFile, 
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
    isSupervisor, setIsSupervisor, 
    isPartner, setIsPartner, 
    isManager, setIsManager, 
    isActive, setIsActive 
}) => {
    
    // Динамически определяем, какую функцию и текст использовать
    const isEditing = !!selectedEmployee; // <--- ИСПРАВЛЕНО
    const handleSubmit = isEditing ? handleUpdateEmployee : handleCreateEmployee;
    const submitButtonText = isEditing ? "Зберегти зміни" : "Додати працівника";

    return (
        <div>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Працівники</h2>
                <button
                    className={styles.toggleButton}
                    onClick={() => {
                        // Если форма скрывается и мы в режиме редактирования, сбросить режим
                        if (isFormVisible && isEditing) {
                            setSelectedEmployee(null); // <--- ИСПРАВЛЕНО
                        }
                        setIsFormVisible(!isFormVisible);
                    }}
                >
                    {isFormVisible ? 
                        (isEditing ? "Скасувати та приховати" : "Приховати форму") : 
                        "Додати нового працівника"
                    }
                </button>
            </div>

            {isFormVisible && (
                <form
                    onSubmit={handleSubmit} // Используем динамический обработчик
                    className={styles.employeeForm}
                >
                    {isEditing && selectedEmployee && (
                        <h3 className={styles.editingHeader}>
                            ✏️ Редагування: {selectedEmployee.firstName} {selectedEmployee.lastName} {/* <--- ИСПРАВЛЕНО */}
                        </h3>
                    )}
                    
                    <div className={styles.formGroup}>
                        <label>Фото:</label>
                        <input
                            type="file"
                            // Не делаем файл обязательным в режиме редактирования
                            required={!isEditing}
                            onChange={(e) =>
                                setEmployeePhotoFile(
                                    e.target.files ? e.target.files[0] : null
                                )
                            }
                        />
                        {isEditing && (
                            <small>Залиште порожнім, щоб зберегти поточне фото.</small>
                        )}
                    </div>
                    
                    {/* ... (остальные поля формы, которые остались без изменений) ... */}
                    
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
                                checked={isSupervisor}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setIsSupervisor(checked);
                                    if (checked) {
                                        setIsManager(false);
                                    }
                                }}
                            />{" "}
                            Керiвник
                        </label>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label>
                            <input
                                type="checkbox"
                                checked={isPartner}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setIsPartner(checked);
                                    if (checked) {
                                        setIsManager(false);
                                    }
                                }}
                            />{" "}
                            Партнер
                        </label>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label>
                            <input
                                type="checkbox"
                                checked={isManager}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setIsManager(checked);
                                    if (checked) {
                                        setIsSupervisor(false);
                                        setIsPartner(false);
                                    }
                                }}
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
                        {submitButtonText}
                    </button>
                    
                    {isEditing && (
                        <button 
                            type="button" 
                            className={styles.cancelBtn} 
                            onClick={() => {
                                setSelectedEmployee(null); // <--- ИСПРАВЛЕНО: Отмена редактирования
                                setIsFormVisible(false); // При необходимости скрываем форму
                            }}
                        >
                            Скасувати редагування
                        </button>
                    )}
                    
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
                                        {employee.isSUPERVISOR && (
                                            <span className={styles.statusTag}>
                                                {" "}
                                                (Керiвник)
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
                                
                                {/* 👇 ИСПРАВЛЕННАЯ КНОПКА РЕДАКТИРОВАНИЯ 👇 */}
                                <button
                                    className={styles.editBtn} 
                                    onClick={() => {
                                        handleEditEmployee(employee); // <--- ВЫЗЫВАЕМ ФУНКЦИЮ ДЛЯ ЗАПОЛНЕНИЯ ПОЛЕЙ
                                        // setEditingEmployee(employee); // ЭТА СТРОКА ТЕПЕРЬ НЕ НУЖНА, Т.К. handleEditEmployee УЖЕ ДЕЛАЕТ ЭТО
                                        setIsFormVisible(true);
                                    }}
                                >
                                    Редагувати
                                </button>
                                
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
    );
};

export default EmployeesSection;