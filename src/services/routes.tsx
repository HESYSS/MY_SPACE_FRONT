import { FC } from "react";
import HomePage from "@/pages/main";
import CatalogPage from "@/pages/catalog/[type]";
import PropertyPage from "@/pages/property/[id]";
import TeamPage from "@/pages/team";
import MapPage from "@/pages/map";
import AboutPage from "@/pages/about";
import ContactsPage from "@/pages/contacts";
import PolicyPage from "@/pages/policy";
import TermsPage from "@/pages/terms";
import AdminPage from "@/pages/admin";
import EmployeePage from "@/pages/worker/[id]";

export interface RouteItem {
  path: string; // URL для браузера
  label?: string; // для меню
  component?: any; // компонент для внутреннего использования (не для рендеринга Next.js)
  alias?: string; // внутренняя логика
}

const routes: RouteItem[] = [
  { path: "/main/index" },
  { path: "/catalog/[type]" },
  { path: "/property/[id]" },
  { path: "/team" },
  { path: "/map" },
  { path: "/about" },
  { path: "/contacts" },
  { path: "/policy" },
  { path: "/terms" },
  { path: "/admin" },
  { path: "/worker" },
];

export default routes;
