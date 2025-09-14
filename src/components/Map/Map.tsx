// src/components/MapDrawFilter.tsx
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Fill, Stroke, Style, Circle as CircleStyle } from "ol/style";
import Polygon from "ol/geom/Polygon";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, toLonLat } from "ol/proj";
import { defaults as defaultInteractions, DragPan } from "ol/interaction";
import Circle from "ol/geom/Circle";
import styles from "./mapStyle.module.css";
import { kyivMetroStations } from "./kyivMetro";

interface Property {
  id: number;
  lat: number;
  lng: number;
  title?: string;
}

const DEFAULT_MAP_VIEW = {
  center: fromLonLat([30.5238, 50.4547]), // Центр Киева
  zoom: 11.5,
};
const FILTERS_STORAGE_KEY = "locationFilters";
const POLYGON_STORAGE_KEY = "mapPolygon";
// Вспомогательные функции для геометрии
const getBoundingBox = (coords: [number, number][]) => {
  const lats = coords.map((c) => c[1]);
  const lngs = coords.map((c) => c[0]);
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
};

const createSquarePolygon = ({ minLat, maxLat, minLng, maxLng }: any) => [
  [minLng, maxLat],
  [maxLng, maxLat],
  [maxLng, minLat],
  [minLng, minLat],
  [minLng, maxLat],
];

export default function MapDrawFilter({
  properties,
  locationFilters,
  onChangeFilters,
}: {
  properties: Property[];
  locationFilters: any;
  onChangeFilters: (filters: any) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);

  const drawSource = useRef(new VectorSource());
  const markerSource = useRef(new VectorSource());
  const metroSource = useRef(new VectorSource());

  const drawing = useRef(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentCoords = useRef<number[][]>([]);
  const dragPanRef = useRef<DragPan | null>(null);

  // Стили для слоев
  const drawStyle = new Style({
    stroke: new Stroke({ color: "rgba(48, 48, 47, 1)", width: 2 }),
  });

  const markerStyle = new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({ color: "#051818" }),
      stroke: new Stroke({ color: "#fff", width: 1 }),
    }),
  });
  const hiddenStyle = new Style({});
  // Remove hiddenMarkerStyle, use setStyle(null) to hide markers

  const metroStyle = new Style({});

  // Мемоизированные слои
  const drawLayer = useMemo(
    () => new VectorLayer({ source: drawSource.current, style: drawStyle }),
    []
  );

  const markerLayer = useMemo(
    () => new VectorLayer({ source: markerSource.current, style: markerStyle }),
    []
  );

  const metroLayer = useMemo(
    () => new VectorLayer({ source: metroSource.current, style: metroStyle }),
    []
  );

  // Фильтрация маркеров по нарисованному полигону
  const filterMarkers = useCallback(
    (polygonCoords3857: number[][], squareCoords3857: number[][]) => {
      const polygonGeom = new Polygon([polygonCoords3857]);
      const squareGeom = new Polygon([squareCoords3857]);

      const insideIds: number[] = [];
      markerSource.current.getFeatures().forEach((f) => {
        const geom = f.getGeometry();
        if (!(geom instanceof Point)) return;

        const coord = geom.getCoordinates();
        const inPolygon = polygonGeom.intersectsCoordinate(coord);
        const inSquare = squareGeom.intersectsCoordinate(coord);

        if (inPolygon) {
          insideIds.push(f.get("id"));
          f.setStyle(markerStyle);
        } else if (inSquare) {
          f.setStyle(hiddenStyle); // Скрываем точки внутри квадрата, но вне полигона
        } else {
          f.setStyle(markerStyle);
        }
      });
      return insideIds;
    },
    [markerStyle]
  );

  // Инициализация карты
  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        markerLayer,
        drawLayer,
        metroLayer,
      ],
      view: new View(DEFAULT_MAP_VIEW),
      interactions: defaultInteractions(),
      controls: [],
    });

    mapInstance.current = map;

    // Находим DragPan interaction
    dragPanRef.current = map
      .getInteractions()
      .getArray()
      .find((i) => i instanceof DragPan) as DragPan;

    const viewport = map.getViewport();

    const handlePointerDown = (e: PointerEvent) => {
      if (!isDrawing || e.button !== 0) return;
      drawing.current = true;
      currentCoords.current = [];
      dragPanRef.current?.setActive(false);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDrawing || !drawing.current) return;
      const pixel = map.getEventPixel(e);
      const coord = map.getCoordinateFromPixel(pixel);
      if (coord) currentCoords.current.push(coord);
      drawSource.current.clear();
      drawSource.current.addFeature(
        new Feature(new Polygon([currentCoords.current]))
      );
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDrawing || e.button !== 0) return;
      drawing.current = false;
      dragPanRef.current?.setActive(true);

      if (currentCoords.current.length < 3) return;

      const polygonCoords = currentCoords.current.map((coord) =>
        toLonLat(coord)
      ) as [number, number][];

      const squareBox = getBoundingBox(polygonCoords);
      const squareCoords = createSquarePolygon(squareBox);

      // Отрисовка квадрата
      const squareFeature = new Feature(
        new Polygon([squareCoords.map((c) => fromLonLat(c))])
      );
      squareFeature.setStyle(new Style({}));
      drawSource.current.addFeature(squareFeature);

      // Фильтрация и отправка данных

      const newFilters = {
        ...locationFilters,
        polygon: squareCoords,
      };

      onChangeFilters(newFilters);
      console.log("New location filters:", newFilters);
      // 🔹 Сохраняем в локальное хранилище
      try {
        localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(newFilters));
        localStorage.setItem(
          POLYGON_STORAGE_KEY,
          JSON.stringify({ ...squareCoords })
        );
      } catch (err) {
        console.error("Не удалось сохранить фильтры в localStorage", err);
      }

      // 🔹 Очищаем слой нарисованного полигона
      drawSource.current.clear();

      setIsDrawing(false);
    };

    viewport.addEventListener("pointerdown", handlePointerDown);
    viewport.addEventListener("pointermove", handlePointerMove);
    viewport.addEventListener("pointerup", handlePointerUp);

    return () => {
      map.setTarget(undefined);
      viewport.removeEventListener("pointerdown", handlePointerDown);
      viewport.removeEventListener("pointermove", handlePointerMove);
      viewport.removeEventListener("pointerup", handlePointerUp);
    };
  }, [
    isDrawing,
    markerLayer,
    drawLayer,
    metroLayer,
    onChangeFilters,
    locationFilters,
    filterMarkers,
  ]);

  // Загрузка и обновление маркеров
  useEffect(() => {
    markerSource.current.clear();
    properties.forEach((p) => {
      markerSource.current.addFeature(
        new Feature({
          geometry: new Point(fromLonLat([p.lng, p.lat])),
          id: p.id,
        })
      );
    });
  }, [properties]);

  // Обновление фильтра при изменении свойств (properties)
  useEffect(() => {
    if (!mapInstance.current || !currentCoords.current.length) return;
    const polygonCoords = currentCoords.current.map((c) => toLonLat(c)) as [
      number,
      number
    ][];
    const squareBox = getBoundingBox(polygonCoords);
    const squareCoords = createSquarePolygon(squareBox);
    filterMarkers(
      currentCoords.current,
      squareCoords.map((c) => fromLonLat(c))
    );
  }, [properties, filterMarkers]);

  // Обновление кругов вокруг станций метро
  useEffect(() => {
    metroSource.current.clear();
    if (locationFilters?.metro?.length) {
      locationFilters.metro.forEach((stationName: string) => {
        const station = kyivMetroStations.find((s) => s.name === stationName);
        if (station) {
          const circle = new Circle(
            fromLonLat([station.lng, station.lat]),
            3000
          );
          const circleFeature = new Feature(circle);
          circleFeature.setStyle(metroStyle);
          metroSource.current.addFeature(circleFeature);
        }
      });
    }
  }, [locationFilters, metroStyle]);

  const handleZoom = (delta: number) => {
    if (!mapInstance.current) return;
    const view = mapInstance.current.getView();
    view.animate({ zoom: view.getZoom()! + delta, duration: 250 });
  };

  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
    if (!isDrawing) {
      drawSource.current.clear();
      currentCoords.current = [];
    }
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.drawButtonContainer}>
        <button onClick={toggleDrawing} className={styles.mapButton}>
          {isDrawing ? "✅" : "✏️"}
        </button>
      </div>

      <div className={styles.zoomButtonsContainer}>
        <button onClick={() => handleZoom(1)} className={styles.mapButton}>
          +
        </button>
        <button onClick={() => handleZoom(-1)} className={styles.mapButton}>
          -
        </button>
      </div>

      <div ref={mapRef} className={styles.mapCanvas} />
    </div>
  );
}
