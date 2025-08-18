// routes/AppRoutes.js
"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";

import HomePage from "@/pages/main/index";
import CatalogPage from "@/pages/catalog/[type]";
import PropertyPage from "@/pages/property/[id]";
import TeamPage from "@/pages/team/index";
import MapPage from "@/pages/map";
import AboutPage from "@/pages/about/index";
import ContactsPage from "@/pages/contacts/index";
import PolicyPage from "@/pages/policy/index";
import TermsPage from "@/pages/terms/index";
import AdminPage from "@/pages/admin/index";

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog/:type" element={<CatalogPage />} />
        <Route path="/property/:id" element={<PropertyPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}
