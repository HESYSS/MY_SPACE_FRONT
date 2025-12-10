import React, { FC, SetStateAction, Dispatch } from 'react';

// Примітка: Для DND-компонентів ми використовуємо 'any' як заглушку, 
// оскільки реальні типи dnd дуже складні. В реальному проекті варто 
// імпортувати їхні типи (наприклад, from 'react-beautiful-dnd').
// Ми також використовуємо 'any' для складних об'єктів (item, image), 
// які потрібно замінити на ваші реальні інтерфейси (наприклад, Image, Item).
type DndComponent = React.ComponentType<any>;

// Інтерфейс для пропсів ImagesSection
interface ImagesSectionProps {
  styles: Record<string, string>; 
  loading: boolean;
  error: string | null;
  images: any[]; // Замініть на ваш тип Image[]
  uploading: boolean;
  items: any[]; // Замініть на ваш тип Item[]
  
  selectedItem: any | null; // Замініть на ваш тип Item | null
  setSelectedItem: Dispatch<SetStateAction<any | null>>; // Замініть на ваш тип Item | null

  setFile: Dispatch<SetStateAction<File | null>>;
  
  // Функції-обробники
  handleImageUpload: (e: React.FormEvent) => Promise<void>; 
  handleImageDelete: (id: number) => Promise<void>; 
  setSelectedImageToUpdate: Dispatch<SetStateAction<any | null>>; // Замініть на ваш тип Image | null
  handleToggleImageActive: (id: number, isActive: boolean) => Promise<void>;
  onDragEnd: (result: any) => void; // Замініть 'any' на DND тип DragEndResponder

  // DND Components (передаються з AdminPage)
  DragDropContext: DndComponent;
  Droppable: DndComponent;
  Draggable: DndComponent;
}

// Застосування інтерфейсу до компонента
const ImagesSection: FC<ImagesSectionProps> = ({ 
  styles, 
  loading, 
  error, 
  images, 
  uploading, 
  items, 
  selectedItem, 
  setSelectedItem, 
  setFile, 
  handleImageUpload, 
  handleImageDelete, 
  setSelectedImageToUpdate, 
  handleToggleImageActive, 
  onDragEnd,
  // DND Components (передаються з AdminPage)
  DragDropContext, 
  Droppable, 
  Draggable
}) => {
  return (
    <div>
      <h2 className={styles.sectionTitle}>Керування зображеннями</h2>

      <h3 className={styles.subTitle}>Зображення товарів</h3>
      <div className={styles.itemSelectContainer}>
        <label htmlFor="item-select">Виберіть об'єкт:</label>
        <select
          id="item-select"
          onChange={(e) => {
            const selectedId = parseInt(e.target.value);
            const item = items.find((i) => i.id === selectedId);
            setSelectedItem(item || null);
          }}
          value={selectedItem?.id || ""}
        >
          <option value="">-- Виберіть об'єкт --</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title} (article: {item.article})
            </option>
          ))}
        </select>
      </div>

      {selectedItem && (
        <div className={styles.itemImagesSection}>
          <h4 className={styles.sectionTitle}>
            Зображення для "{selectedItem.title}"
          </h4>
          <p>
            Перетягніть зображення, щоб змінити порядок. Клікніть, щоб
            змінити видимість.
          </p>
          {loading && <p>Завантаження зображень...</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}

          {!loading &&
          !error &&
          selectedItem.images &&
          selectedItem.images.length > 0 ? (
            // Використовуємо DND компоненти, передані через пропси
// ImagesSection.tsx (фрагмент з DragDropContext)

            <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
                droppableId="images-droppable"
                direction="horizontal"
            >
                {/* ВИПРАВЛЕННЯ: Явно вказуємо 'any' для provided */}
                {(provided: any) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={styles.itemImageList}
                >
                    {/* ВИПРАВЛЕННЯ: Явно вказуємо 'any' для image та index */}
                    {selectedItem.images.map((image: any, index: any) => (
                    <Draggable
                        key={image.id}
                        draggableId={String(image.id)}
                        index={index}
                    >
                        {/* ВИПРАВЛЕННЯ: Явно вказуємо 'any' для provided */}
                        {(provided: any) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                            ...provided.draggableProps.style,
                            opacity: image.isActive ? 1 : 0.5,
                            }}
                            className={styles.itemImageCard}
                        >
                            <div
                            {...provided.dragHandleProps}
                            className={styles.dragHandle}
                            >
                            <img
                                src={image.url}
                                className={styles.itemImagePreview}
                                onClick={() =>
                                handleToggleImageActive(
                                    image.id,
                                    image.isActive
                                )
                                }
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

      <h3 className={styles.subTitle}>Зображення сайту (завантаження)</h3>
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
  );
};

export default ImagesSection;
