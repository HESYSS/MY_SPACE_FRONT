// pages/_app.js
import ClientRouter from "../components/ClientRouter/ClientRouter";
import AppRoutes from "../AppRoutes";
/*import "../styles/globals.css";
 */
export default function MyApp() {
  return (
    <ClientRouter fallback={null}>
      <AppRoutes />
    </ClientRouter>
  );
}
