// src/components/MapDrawFilter.tsx
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Fill, Stroke, Style, Circle as CircleStyle } from "ol/style";
import Polygon, { fromCircle as polygonFromCircle } from "ol/geom/Polygon";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, toLonLat } from "ol/proj";
import { defaults as defaultInteractions, DragPan } from "ol/interaction";
import Circle from "ol/geom/Circle";
import { GeoJSON } from "ol/format"; // 👈 для загрузки geojson
import styles from "./mapStyle.module.css";
import { kyivMetroStations } from "./kyivMetro";
import kyivDistricts from "./kyiv.json"; // 👈 твой файл с районами
import MultiPolygon from "ol/geom/MultiPolygon";

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
const current_STORAGE_KEY = "currentCoords";
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
  const [hasPolygon, setHasPolygon] = useState(false);
  const drawSource = useRef(new VectorSource());
  const markerSource = useRef(new VectorSource());
  const metroSource = useRef(new VectorSource());
  const districtsSource = useRef(new VectorSource());
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
  const districtsLayer = useMemo(
    () => new VectorLayer({ source: districtsSource.current }),
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
  useEffect(() => {
    // Загрузка станций метро в векторный источник
    const save = localStorage.getItem(current_STORAGE_KEY);
    if (save) {
      currentCoords.current = JSON.parse(save);
    }
  });
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
        districtsLayer,
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
      localStorage.setItem(current_STORAGE_KEY, JSON.stringify(polygonCoords));
      console.log("Drawn polygon coords (lon/lat):", polygonCoords);
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
  }, [isDrawing, locationFilters]);

  // Загрузка и обновление маркеров
  useEffect(() => {
    if (!markerSource.current) return;

    const existingFeatures = markerSource.current.getFeatures();
    const existingIds = new Set(existingFeatures.map((f) => f.get("id")));
    const newIds = new Set(properties.map((p) => p.id));

    // 1. Удаляем те маркеры, которых больше нет в данных
    existingFeatures.forEach((f) => {
      if (!newIds.has(f.get("id"))) {
        markerSource.current.removeFeature(f);
      }
    });

    // 2. Добавляем новые маркеры, которых ещё нет
    properties.forEach((p) => {
      if (!existingIds.has(p.id)) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([p.lng, p.lat])),
          id: p.id,
        });
        feature.setStyle(markerStyle); // 👈 если нужен стиль
        markerSource.current.addFeature(feature);
      }
    });

    // 3. (опционально) обновляем координаты, если они изменились
    properties.forEach((p) => {
      const feature = existingFeatures.find((f) => f.get("id") === p.id);
      if (feature) {
        const geom = feature.getGeometry();
        if (geom instanceof Point) {
          const coords = geom.getCoordinates();
          const newCoords = fromLonLat([p.lng, p.lat]);
          if (coords[0] !== newCoords[0] || coords[1] !== newCoords[1]) {
            geom.setCoordinates(newCoords);
          }
        }
      }
    });
  }, [properties]);
  // ... остальной код без изменений ...

  useEffect(() => {
    districtsSource.current.clear();

    // === 1. "За містом" ===
    if (locationFilters?.isOutOfCity) {
      const features = new GeoJSON().readFeatures(kyivDistricts, {
        featureProjection: "EPSG:3857",
      });

      features.forEach((f) =>
        f.setStyle(
          new Style({ fill: new Fill({ color: "rgba(34, 34, 34, 0.7)" }) })
        )
      );

      districtsSource.current.addFeatures(features);
      return;
    }

    // === 2. Районы Киева ===
    const features = new GeoJSON().readFeatures(kyivDistricts, {
      featureProjection: "EPSG:3857",
    });

    // --- circles для метро ---
    const metroCircles: Polygon[] = [];
    const metroLines: any[] = [];
    if (
      Array.isArray(locationFilters?.metro) &&
      locationFilters.metro.length > 0
    ) {
      locationFilters.metro.forEach((stationName: string) => {
        const station = kyivMetroStations.find((s) => s.name === stationName);
        if (!station) return;
        const circleGeom = new Circle(
          fromLonLat([station.lng, station.lat]),
          3000
        );
        const circlePolygon = polygonFromCircle(circleGeom, 64);
        metroCircles.push(circlePolygon);
        metroLines.push(station.line);
      });
    }

    // --- полигон пользователя ---
    let filterPolygon: Polygon | null = null;
    if (
      locationFilters?.polygon &&
      Array.isArray(locationFilters.polygon) &&
      locationFilters.polygon.length > 0
    ) {
      console.log("Saved polygon from localStorage:", currentCoords);
      if (currentCoords.current && currentCoords.current.length > 2) {
        const coords3857 = currentCoords.current.map((c) => c);
        filterPolygon = new Polygon([coords3857]);
      }
    }

    // --- проверка: все фильтры пустые ---
    const noFilters =
      !locationFilters?.districts || locationFilters.districts.length === 0;

    // --- собираем все дырки для маски ---
    const holes: [number, number][][] = [];

    // районы, которые активны (подсвечиваются) → станут дырками
    features.forEach((feature) => {
      const rawName = feature.get("NAME") as string;
      const districtName = rawName.replace("район", "").trim();
      const isActive =
        noFilters ||
        (Array.isArray(locationFilters?.districts) &&
          locationFilters.districts.includes(districtName));

      if (isActive) {
        const geom = feature.getGeometry();
        if (geom instanceof Polygon)
          holes.push(geom.getCoordinates()[0] as [number, number][]);
        else if (geom instanceof MultiPolygon)
          geom
            .getCoordinates()
            .forEach((poly) => holes.push(poly[0] as [number, number][]));
      }
    });

    // пользовательский полигон
    if (filterPolygon) {
      holes.push(
        filterPolygon.getCoordinates()[0].map((coord) => [coord[0], coord[1]])
      );
    }

    // === 3. Маска вокруг города ===
    const worldExtent = [-20037508, -20037508, 20037508, 20037508];
    const worldPolygon = new Polygon([
      [
        [worldExtent[0], worldExtent[1]],
        [worldExtent[0], worldExtent[3]],
        [worldExtent[2], worldExtent[3]],
        [worldExtent[2], worldExtent[1]],
        [worldExtent[0], worldExtent[1]],
      ],
    ]);

    const maskFeature = new Feature(
      new Polygon([worldPolygon.getCoordinates()[0], ...holes])
    );
    maskFeature.setStyle(
      new Style({ fill: new Fill({ color: "rgba(34, 34, 34, 0.7)" }) })
    );
    districtsSource.current.addFeature(maskFeature);

    // === 4. Добавляем круги метро как отдельные элементы (не как дырки) ===
    metroCircles.forEach((circle, index) => {
      const feature = new Feature(circle);
      feature.setStyle(
        new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0)", // Прозрачная заливка
          }),
          stroke: new Stroke({
            color: metroLines[index] || "blue",
            width: 1,
          }),
        })
      );
      districtsSource.current.addFeature(feature);
    });

    // === 5. Подсветка выбранных районов ===
    features.forEach((feature) => {
      const rawName = feature.get("NAME") as string;
      const districtName = rawName.replace("район", "").trim();
      const isActive =
        noFilters ||
        (Array.isArray(locationFilters?.districts) &&
          locationFilters.districts.includes(districtName));

      feature.setStyle(
        new Style({
          fill: new Fill({
            color: isActive ? "rgba(0,0,0,0)" : "rgba(0,0,0,0)",
          }),
        })
      );
    });
    districtsSource.current.addFeatures(features);
  }, [
    locationFilters?.isOutOfCity,
    locationFilters?.districts,
    locationFilters?.metro,
    locationFilters?.polygon,
  ]);

  // ... остальной код без изменений ...

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

  const handleZoom = (delta: number) => {
    if (!mapInstance.current) return;
    const view = mapInstance.current.getView();
    view.animate({ zoom: view.getZoom()! + delta, duration: 250 });
  };

  const handlePolygonButton = () => {
    if (isDrawing) {
      // Завершаем рисование
      setIsDrawing(false);
    } else if (currentCoords.current.length > 0) {
      console.log("Clearing drawn polygon", currentCoords);
      const newFilters = {
        ...locationFilters,
        polygon: [],
      };

      onChangeFilters(newFilters);
      console.log("New location filters:", newFilters);
      // 🔹 Сохраняем в локальное хранилище
      try {
        localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(newFilters));
        localStorage.removeItem(POLYGON_STORAGE_KEY);
        localStorage.removeItem(current_STORAGE_KEY);
      } catch (err) {
        console.error("Не удалось сохранить фильтры в localStorage", err);
      }
      drawSource.current.clear();
      currentCoords.current = [];
    } else {
      // Начинаем рисовать
      setIsDrawing(true);
      drawSource.current.clear();
      currentCoords.current = [];
    }
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.drawButtonContainer}>
        <button onClick={handlePolygonButton} className={styles.mapButton}>
          {
            isDrawing
              ? "✅" // активно рисуем
              : currentCoords.current.length > 0
              ? "✖" // есть полигон → удалить
              : "✏️" // ничего нет → начать рисовать
          }
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
