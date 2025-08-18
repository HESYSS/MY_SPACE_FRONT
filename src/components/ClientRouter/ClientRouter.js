// components/ClientRouter.js
"use client";

import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

export default function ClientRouter({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Пока нет клиента — показываем заглушку
  if (!isClient) return fallback;

  return <BrowserRouter>{children}</BrowserRouter>;
}
