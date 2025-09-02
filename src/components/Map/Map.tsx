import { useEffect, useRef, useState } from "react";
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
import styles from "./mapStyle.module.css";

interface Property {
  id: number;
  lat: number;
  lng: number;
  title?: string;
}

export default function MapDrawFilter({
  properties,
}: {
  properties: Property[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);

  const drawSource = useRef(new VectorSource());
  const drawLayer = useRef(
    new VectorLayer({
      source: drawSource.current,
      style: new Style({
        stroke: new Stroke({ color: "#ff0", width: 2 }),
        fill: new Fill({ color: "rgba(255,255,0,0.4)" }),
      }),
    })
  );

  // слой с маркерами
  const markerSource = useRef(new VectorSource());
  const markerLayer = useRef(
    new VectorLayer({
      source: markerSource.current,
      style: new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: "#051818" }),
          stroke: new Stroke({ color: "#fff", width: 1 }),
        }),
      }),
    })
  );

  const drawing = useRef(false);
  const [active, setActive] = useState(false);
  const currentCoords = useRef<number[][]>([]);
  const dragPanRef = useRef<DragPan | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        markerLayer.current,
        drawLayer.current,
      ],
      view: new View({
        center: fromLonLat([30.5, 50.5]),
        zoom: 12,
      }),
      interactions: defaultInteractions(),
      controls: [],
    });

    mapInstance.current = map;

    // Загружаем все точки
    markerSource.current.clear();
    properties.forEach((p) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([p.lng, p.lat])),
        id: p.id,
      });
      markerSource.current.addFeature(feature);
    });

    // Найдём DragPan
    const dragPan = map
      .getInteractions()
      .getArray()
      .find((i) => i instanceof DragPan) as DragPan;
    dragPanRef.current = dragPan;

    // ЛКМ вниз — начало рисования
    map.getViewport().addEventListener("pointerdown", (e: PointerEvent) => {
      if (!active) return;
      if (e.button !== 0) return;
      drawing.current = true;
      currentCoords.current = [];
      if (dragPanRef.current) dragPanRef.current.setActive(false);
    });

    // движение — добавляем точки
    map.getViewport().addEventListener("pointermove", (e: PointerEvent) => {
      if (!active || !drawing.current) return;
      const pixel = map.getEventPixel(e);
      const coord = map.getCoordinateFromPixel(pixel);
      if (coord) {
        currentCoords.current.push(coord);
        const poly = new Polygon([currentCoords.current]);
        drawSource.current.clear();
        drawSource.current.addFeature(new Feature(poly));
      }
    });

    // отпускание ЛКМ — заканчиваем
    map.getViewport().addEventListener("pointerup", (e: PointerEvent) => {
      if (!active || e.button !== 0) return;
      drawing.current = false;
      if (dragPanRef.current) dragPanRef.current.setActive(true);

      if (currentCoords.current.length > 2) {
        const polygon = new Polygon([currentCoords.current]);
        const coords = currentCoords.current.map((c) => toLonLat(c));
        console.log("Polygon coords:", coords);

        // ФИЛЬТРАЦИЯ: проверяем, какие точки попадают в область
        const inside: number[] = [];
        markerSource.current.getFeatures().forEach((f) => {
          const geom = f.getGeometry();
          if (geom && geom instanceof Point) {
            if (polygon.intersectsCoordinate(geom.getCoordinates())) {
              inside.push(f.get("id"));
            }
          }
        });

        console.log("Попали внутрь:", inside);

        // Подсветим выбранные точки
        markerLayer.current.setStyle((feature) => {
          const id = feature?.get("id");
          const isInside = inside.includes(id);
          return new Style({
            image: new CircleStyle({
              radius: isInside ? 7 : 5,
              fill: new Fill({ color: isInside ? "red" : "#051818" }),
              stroke: new Stroke({ color: "#fff", width: 1 }),
            }),
          });
        });
      }
    });

    return () => map.setTarget(undefined);
  }, [active, properties]);

  const handleZoom = (delta: number) => {
    if (mapInstance.current) {
      const view = mapInstance.current.getView();
      const newZoom = view.getZoom()! + delta;
      view.animate({
        zoom: newZoom,
        duration: 250,
      });
    }
  };

  return (
    <div className={styles.mapContainer}>
      {/* Кнопка рисования (в левом верхнем углу) */}
      <div className={styles.drawButtonContainer}>
        <button onClick={() => setActive(!active)} className={styles.mapButton}>
          {active ? "✅" : "✏️"}
        </button>
      </div>

      {/* Контейнер для кнопок зума (в правом верхнем углу) */}
      <div className={styles.zoomButtonsContainer}>
        <button onClick={() => handleZoom(1)} className={styles.mapButton}>
          +
        </button>
        <button onClick={() => handleZoom(-1)} className={styles.mapButton}>
          -
        </button>
      </div>

      {/* Контейнер карты */}
      <div
        ref={mapRef}
        className={styles.mapCanvas} // <-- Применяем новый класс
      />
    </div>
  );
}