// MapSinglePoint.tsx
import { useEffect, useRef, useMemo } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";

interface Location {
  lat: number;
  lng: number;
  title?: string;
}

interface Props {
  location: Location | null; // точка для отображения
  zoom?: number; // необязательный уровень зума
}

export default function MapSinglePoint({ location, zoom = 15 }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);

  // Векторный слой для маркера
  const markerSource = useRef(new VectorSource());
  const markerLayer = useMemo(
    () =>
      new VectorLayer({
        source: markerSource.current,
        style: new Style({
          image: new CircleStyle({
            radius: 8,
            fill: new Fill({ color: "#050505" }),
            stroke: new Stroke({ color: "#fff", width: 2 }),
          }),
        }),
      }),
    []
  );

  // Инициализация карты
  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() }), markerLayer],
      view: new View({
        center: location
          ? fromLonLat([location.lng, location.lat])
          : fromLonLat([30.5238, 50.4547]),
        zoom: location ? zoom : 11,
      }),
      controls: [],
    });

    mapInstance.current = map;
  }, [markerLayer]);

  // Обновление точки и центрирование
  useEffect(() => {
    if (!location || !mapInstance.current) return;

    const coords = fromLonLat([location.lng, location.lat]);

    // Очищаем предыдущие маркеры
    markerSource.current.clear();

    // Добавляем новый маркер
    const feature = new Feature({
      geometry: new Point(coords),
      title: location.title,
    });
    markerSource.current.addFeature(feature);

    // Центрируем карту на маркере с анимацией
    mapInstance.current.getView().animate({
      center: coords,
      zoom: zoom,
      duration: 500,
    });
  }, [location, zoom]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "905px",
        height: "668.98px",
      }}
    />
  );
}
