import React, { ReactNode } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { ModalProvider } from "../../hooks/useModal";
import ConsultationModal from "../Header/ConsultationModal/ConsultationModal";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <ModalProvider>
      {" "}
      <div className="layout">
        <Header />
        <main>{children}</main>
        <Footer />
        <ConsultationModal />
      </div>
    </ModalProvider>
  );
};

export default Layout;
