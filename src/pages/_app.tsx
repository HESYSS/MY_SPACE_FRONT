// pages/_app.tsx

import { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { I18nextProvider } from "react-i18next";
import "./global.css";
import { DefaultSeo } from "next-seo";
import SEO from "../config/next-seo.config";
import i18n from "i18n";
import { useEffect, useState } from "react";

// Компонент для клиентской отрисовки
const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <ClientOnly>
        <Layout>
          <DefaultSeo {...SEO} />
          <Component {...pageProps} />
        </Layout>
      </ClientOnly>
    </I18nextProvider>
  );
}

export default MyApp;
