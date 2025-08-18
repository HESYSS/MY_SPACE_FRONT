// src/components/Layout.tsx
import React, { ReactNode } from "react";
import Header from "../Header";
import Footer from "../Footer";
import OurValues from "../Principles";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Header />
      <main>{children}</main>
      <OurValues/>
      <Footer />
    </div>
  );
};

export default Layout;
