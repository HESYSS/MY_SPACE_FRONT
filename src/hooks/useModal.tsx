// hooks/useModal.tsx

import { createContext, useContext, useState, ReactNode } from 'react';

type PreselectedForWhom = 'forSellers' | 'forBuyers' | null;

interface ModalContextType {
  isModalOpen: boolean;
  preselectedForWhom: PreselectedForWhom;
  openModal: (value: PreselectedForWhom) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [preselectedForWhom, setPreselectedForWhom] = useState<PreselectedForWhom>(null);

  const openModal = (value: PreselectedForWhom) => {
    setPreselectedForWhom(value);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setPreselectedForWhom(null);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, preselectedForWhom, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};