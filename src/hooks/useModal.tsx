import { createContext, useContext, useState, ReactNode } from "react";

type PreselectedForWhom = "forSellers" | "forBuyers" | null;
// --- НОВЫЙ ТИП для артикула ---
type PropertyArticle = string | null;

interface ModalContextType {
  isModalOpen: boolean;
  preselectedForWhom: PreselectedForWhom;
  propertyArticle: PropertyArticle; // <--- ДОБАВЛЕНО
  openModal: (value?: PreselectedForWhom, article?: PropertyArticle) => void; // <--- ИЗМЕНЕНО
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [preselectedForWhom, setPreselectedForWhom] =
    useState<PreselectedForWhom>(null);
  const [propertyArticle, setPropertyArticle] = useState<PropertyArticle>(null); // <--- ДОБАВЛЕНО

  // openModal теперь принимает второй необязательный аргумент: article
  const openModal = (
    value: PreselectedForWhom = null,
    article: PropertyArticle = null
  ) => {
    setPreselectedForWhom(value);
    setPropertyArticle(article); // <--- СОХРАНЯЕМ АРТИКУЛ
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setPreselectedForWhom(null);
    setPropertyArticle(null); // <--- ОЧИЩАЕМ АРТИКУЛ при закрытии
  };

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        preselectedForWhom,
        propertyArticle, // <--- ПЕРЕДАЕМ В КОНТЕКСТ
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
