// AdminsSection.tsx

import React, { FC, Dispatch, SetStateAction } from 'react';
// 🛑 ВИДАЛЯЄМО ЛОКАЛЬНЕ ОГОЛОШЕННЯ Admin ТА AdminRole!
// ⬇️ ІМПОРТУЄМО КОРЕКТНИЙ ТИП Admin З УНІФІКОВАНОГО ФАЙЛУ
import { Admin } from '../types/interface'; 

// Тип для ролі (використовуємо string, як ви просили)
type AdminRoleLiteral = "ADMIN" | "SUPERADMIN"; // Для селектора (літерали)

// 1. ОНОВЛЕННЯ інтерфейсу для пропсів
interface AdminsSectionProps {
  styles: Record<string, string>;
  loading: boolean;
  error: string | null;
  
  // ВИПРАВЛЕНО: Тепер AdminsSection очікує Admin[] з коректними полями (username, role: string)
  admins: Admin[]; 
  
  isFormVisible: boolean;
  setIsFormVisible: Dispatch<SetStateAction<boolean>>;
  
  // Обробники
  handleCreateAdmin: (e: React.FormEvent) => Promise<void>;
  handleDeleteAdmin: (id: number) => Promise<void>;
  // ВИПРАВЛЕНО: Функція очікує string, як ми домовлялись
  handleUpdateRole: (id: number, newRole: string) => Promise<void>; 
  
  // ВИПРАВЛЕНО: Пропси форми - відповідно до логіки AdminPage (username/password)
  adminUsername: string; setAdminUsername: Dispatch<SetStateAction<string>>;
  adminPassword: string; setAdminPassword: Dispatch<SetStateAction<string>>;
  adminRole: string; setAdminRole: Dispatch<SetStateAction<string>>;

  // ВИПРАВЛЕНО: Тип для поточного користувача - використовуємо 'username', як у вашій системі
  userAuthInfo: { role: string, username: string }; 
}

// 2. Застосування інтерфейсу до компонента
const AdminsSection: FC<AdminsSectionProps> = ({ 
  styles, 
  loading, 
  error, 
  admins, 
  isFormVisible, 
  setIsFormVisible, 
  handleCreateAdmin, 
  handleDeleteAdmin,
  handleUpdateRole,
  
  // ВИПРАВЛЕНО: Отримуємо username/password
  adminUsername, setAdminUsername,
  adminPassword, setAdminPassword,
  adminRole, setAdminRole,
  userAuthInfo // ВИКОРИСТОВУЄМО userAuthInfo
}) => {
  return (
    <div className={styles.adminsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Керування адміністраторами</h2>
        <button
          className={styles.toggleButton}
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          {isFormVisible ? "Приховати форму" : "Додати нового адміна"}
        </button>
      </div>

      {isFormVisible && (
        <form onSubmit={handleCreateAdmin} className={styles.adminForm}>
          {/* 🛑 ВИПРАВЛЕНО: Форма тепер використовує username/password */}
          
          <div className={styles.formGroup}>
            <label>Ім'я користувача (Username):</label>
            <input
              type="text"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Пароль:</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Роль:</label>
            <select
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value)}
              required
            >
              {/* ВИКОРИСТОВУЄМО ТИПИ-ЛІТЕРАЛИ ДЛЯ ЗНАЧЕНЬ */}
              <option value="admin">admin</option>
              <option value="superadmin">superadmin</option>
            </select>
          </div>
          <button type="submit" className={styles.submitBtn}>
            Створити адміністратора
          </button>
        </form>
      )}

      <hr className={styles.divider} />

      <h3 className={styles.subTitle}>Список існуючих адміністраторів</h3>
      {loading && <p>Завантаження...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {!loading && !error && admins.length > 0 && (
        <div className={styles.adminList}>
          {admins.map((admin: Admin) => ( 
            <div key={admin.id} className={styles.adminCard}>
              <div className={styles.adminCardContent}>
                <div>
                  <p>
                    {/* ВИПРАВЛЕНО: Відображаємо username (firstName/lastName/email відсутні в Admin) */}
                    <strong>
                      {admin.username}
                    </strong>
                  </p>
                  <p>Створено: {new Date(admin.createdAt).toLocaleDateString()}</p>
                  <p>
                    Роль:{" "}
                    <span className={styles.adminRole}>{admin.role}</span>
                  </p>
                </div>
                <div className={styles.adminActions}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteAdmin(admin.id)}
                    // ВИПРАВЛЕНО: Використовуємо 'username' для перевірки
                    disabled={admin.username === userAuthInfo.username} 
                  >
                    Видалити
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && admins.length === 0 && (
        <p>Список адміністраторів порожній.</p>
      )}
    </div>
  );
};

export default AdminsSection;