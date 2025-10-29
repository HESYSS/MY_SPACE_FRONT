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

// Импорт унифицированных интерфейсов (остаются для типизации пропсов компонентов)
// Интерфейсы CustomJwtPayload и UserAuthType теперь находятся в useAdminPageLogic.ts
// import { Offer, Employee, Admin, Item, SiteImage } from './types/interface';


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
      <button onClick={handleLogout} className={styles.logoutBtn}>
        Выйти
      </button>
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "employees" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("employees")}
        >
          Сотрудники
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
          Изображения
        </button>
        {userRole === "superadmin" && (
          <button
            className={`${styles.tabButton} ${
              activeTab === "admins" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("admins")}
          >
            Админы
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
            
            // Пропсы формы
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
              <h3>Обновить изображение: {selectedImageToUpdate.name}</h3>
              <p>Выберите новый файл для замены текущего.</p>
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