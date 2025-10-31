import React, { Dispatch, SetStateAction } from "react";
import styles from "./admin.module.css";
import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";

// ИМПОРТ ХУКА
import { useAdminPageLogic } from '../../hooks/useAdminPageLogic';

// Импорт компонентов вкладок
import EmployeesSection from './Tabs/EmployeesTab';
import ImagesSection from "./Tabs/ImagesTab";
import OffersSection from "./Tabs/OffersTab";
import AdminsSection from "./Tabs/AdminsTab";


const AdminPage: React.FC = () => {
    // 🛑 ВСЯ ЛОГИКА ТЕПЕРЬ ВЫНЕСЕНА В ХУК!
    const { 
        // Состояния
        activeTab, setActiveTab,
        isFormVisible, setIsFormVisible,
        isFormVisibleAdmins, setIsFormVisibleAdmins,
        employees,
        offers,
        images,
        admins,
        loading,
        error,
        uploading,
        selectedImageToUpdate, setSelectedImageToUpdate,
        isLoggedIn,
        username, setUsername,
        password, setPassword,
        authError,
        userRole,
        userAuthInfo,
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
        
        // НОВОЕ СОСТОЯНИЕ ДЛЯ РЕДАКТИРОВАНИЯ СОТРУДНИКА
        selectedEmployee, setSelectedEmployee, // <-- ДОБАВЛЕНО/ИСПРАВЛЕНО
        handleEditEmployee, // <--- ДОБАВЛЕНО

        // Состояния формы админов
        newAdminUsername, setNewAdminUsername,
        newAdminPassword, setNewAdminPassword,
        newAdminRole, setNewAdminRole,

        // Состояния Items/Images
        items,
        selectedItem, setSelectedItem,

        // Функции
        handleImageUpload,
        handleUpdate,
        handleImageDelete,
        handleUpdateStatus,
        getStatusLabel,
        handleCreateEmployee,
        // НОВАЯ ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ СОТРУДНИКА
        handleUpdateEmployee, // <--- ДОБАВЛЕНО
        handleDelete,
        handleLogin,
        handleLogout,
        handleCreateAdmin,
        handleDeleteAdmin,
        handleUpdateRole,
        handleToggleImageActive,
        onDragEnd,
    } = useAdminPageLogic();


    // -------------------------------------------------------------
    // РЕНДЕРИНГ (Остается неизменным)
    // -------------------------------------------------------------

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
              {loading ? "Вход..." : "Войти"}
            </button>
            {authError && <p className={styles.errorMessage}>{authError}</p>}
          </form>
        </div>
      );
    }

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
            Співробітники
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "offers" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("offers")}
          >
            Заяви
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
            <EmployeesSection 
              styles={styles} 
              loading={loading} 
              error={error} 
              employees={employees} 
              isFormVisible={isFormVisible} 
              setIsFormVisible={setIsFormVisible} 
              handleCreateEmployee={handleCreateEmployee} 
              handleDelete={handleDelete}
              
              // 💡 ИСПРАВЛЕННЫЕ ПРОПСЫ ДЛЯ РЕДАКТИРОВАНИЯ
              selectedEmployee={selectedEmployee} // <-- Объект (или null) для определения режима формы
              setSelectedEmployee={setSelectedEmployee} // <-- Функция для сброса режима редактирования
              handleEditEmployee={handleEditEmployee} // <-- Функция для запуска редактирования
              handleUpdateEmployee={handleUpdateEmployee} // <-- Функция для отправки обновления
              
              // Пропсы формы (используются и для создания, и для редактирования)
              setEmployeePhotoFile={setEmployeePhotoFile}
              firstName={firstName} setFirstName={setFirstName}
              lastName={lastName} setLastName={setLastName}
              position={position} setPosition={setPosition}
              experienceYears={experienceYears} setExperienceYears={setExperienceYears}
              profile={profile} setProfile={setProfile}
              aboutMe={aboutMe} setAboutMe={setAboutMe}
              firstNameEn={firstNameEn} setFirstNameEn={setFirstNameEn}
              lastNameEn={lastNameEn} setLastNameEn={setLastNameEn}
              positionEn={positionEn} setPositionEn={setPositionEn}
              profileEn={profileEn} setProfileEn={setProfileEn}
              aboutMeEn={aboutMeEn} setAboutMeEn={setAboutMeEn}
              isSupervisor={isSupervisor} setIsSupervisor={setIsSupervisor}
              isPartner={isPartner} setIsPartner={setIsPartner}
              isManager={isManager} setIsManager={setIsManager}
              isActive={isActive} setIsActive={setIsActive}
            />
          )}
          {activeTab === "offers" && (
            <OffersSection 
              styles={styles} 
              loading={loading} 
              error={error} 
              offers={offers} 
              handleUpdateStatus={handleUpdateStatus} 
              getStatusLabel={getStatusLabel}
            />
          )}
          {activeTab === "images" && (
              <ImagesSection 
                styles={styles} 
                loading={loading} 
                error={error} 
                images={images} 
                uploading={uploading} 
                items={items} 
                selectedItem={selectedItem} 
                setSelectedItem={setSelectedItem} 
                setFile={setFile} 
                handleImageUpload={handleImageUpload} 
                handleImageDelete={handleImageDelete} 
                setSelectedImageToUpdate={setSelectedImageToUpdate} 
                handleToggleImageActive={handleToggleImageActive} 
                onDragEnd={onDragEnd}
                DragDropContext={DragDropContext}
                Droppable={Droppable}
                Draggable={Draggable}
              />
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
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Вкладка Admins */}
          {activeTab === "admins" && userAuthInfo && userAuthInfo.role === "superadmin" && (
            <AdminsSection 
              styles={styles} 
              loading={loading} 
              error={error} 
              admins={admins} 
              
              isFormVisible={isFormVisibleAdmins} 
              // set state cast is safe here
              setIsFormVisible={setIsFormVisibleAdmins as Dispatch<SetStateAction<boolean>>} 
              handleCreateAdmin={handleCreateAdmin} 
              handleDeleteAdmin={handleDeleteAdmin} 
              handleUpdateRole={handleUpdateRole} 
              
              // Пропсы формы
              adminUsername={newAdminUsername} 
              // set state cast is safe here
              setAdminUsername={setNewAdminUsername as Dispatch<SetStateAction<string>>}
              adminPassword={newAdminPassword} 
              // set state cast is safe here
              setAdminPassword={setNewAdminPassword as Dispatch<SetStateAction<string>>}
              adminRole={newAdminRole} 
              // set state cast is safe here
              setAdminRole={setNewAdminRole as Dispatch<SetStateAction<string>>} 
              userAuthInfo={userAuthInfo} 
            />
          )}
        </div>
      </div>
    );
};

export default AdminPage;