import ClientRouter from "../components/ClientRouter/ClientRouter";
import AppRoutes from "../AppRoutes";
import "./global.css";
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n'; // Импортируем наш файл настроек

export default function MyApp() {
  return (
    <I18nextProvider i18n={i18n}>
      <ClientRouter fallback={null}>
        <AppRoutes />
      </ClientRouter>
    </I18nextProvider>
  );
}