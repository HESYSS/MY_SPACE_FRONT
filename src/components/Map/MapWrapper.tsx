"use client";
import * as React from "react";
import MapDrawFilter from "./Map"; // MapDrawFilter вместо Map3DComponent

export default function MapWrapper({
  properties,
  locationFilters,
  onChangeFilters, // 👈 добавляем проп для callback
}: {
  properties: any[];
  locationFilters: any;
  onChangeFilters: (filters: any) => void;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <MapDrawFilter
      properties={properties}
      locationFilters={locationFilters}
      onChangeFilters={onChangeFilters} // 👈 передаем колбэк в MapDrawFilter
    />
  );
}
