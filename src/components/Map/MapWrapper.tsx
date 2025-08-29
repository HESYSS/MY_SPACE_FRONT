"use client";
import * as React from "react";
import Map3DComponent from "./Map";

export default function MapWrapper(props: any) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // ничего не рендерим на SSR / до монтирования

  return <Map3DComponent {...props} />;
}
