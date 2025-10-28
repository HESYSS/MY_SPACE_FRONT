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
import { GeoJSON } from "ol/format";
import styles from "./mapStyle.module.css";
import { kyivMetroStations } from "./kyivMetro";
import kyivDistricts from "./kyiv.json";
import MultiPolygon from "ol/geom/MultiPolygon";
import { useRouter } from "next/router";
import Geometry from "ol/geom/Geometry";

interface Property {
  id: number;
  lat: number;
  lng: number;
  slug?: string;
}

const DEFAULT_MAP_VIEW = {
  center: fromLonLat([30.5248, 50.404]),
  zoom: 10.4,
};
const FILTERS_STORAGE_KEY = "locationFilters";
const POLYGON_STORAGE_KEY = "mapPolygon";
const current_STORAGE_KEY = "currentCoords";
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
  const [savedPolygon, setSavedPolygon] = useState<any[]>([]);
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
  const router = useRouter();
  const dragPanRef = useRef<DragPan | null>(null);
  const drawStyle = new Style({
    stroke: new Stroke({ color: " #050505", width: 2 }),
  });

  const markerStyle = new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({ color: "#051818" }),
      stroke: new Stroke({ color: "#fff", width: 1 }),
    }),
  });
  const highlightStyle = new Style({
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({ color: "#1a3f3f" }),
      stroke: new Stroke({ color: "#fff", width: 1 }),
    }),
  });
  const hiddenStyle = new Style({});
  const metroStyle = new Style({});

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
        } else if (inSquare && !inPolygon) {
          f.setStyle(hiddenStyle);
        } else if (!inSquare && !inPolygon) {
          f.setStyle(markerStyle);
        }
      });
      return insideIds;
    },
    [markerStyle]
  );

  useEffect(() => {
    currentCoords.current = locationFilters?.polygon || [];
    if (locationFilters?.polygon && locationFilters.polygon.length > 0) {
      const stored = localStorage.getItem(POLYGON_STORAGE_KEY);
      setSavedPolygon(stored ? JSON.parse(stored) : []);
    } else {
      drawSource.current.clear();
      setSavedPolygon([]);
    }
  }, [locationFilters]);

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

    // Навигация по клику
    map.on("singleclick", (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (f, layer) => {
        if (layer === markerLayer && f instanceof Feature) return f;
        return null;
      });

      if (feature) {
        const link = feature.get("link");
        if (link) router.push(link); // 👈 переход только один
      }
    });

    let hoveredFeature: Feature<Geometry> | null = null;

    map.on("pointermove", (evt) => {
      // Берём только маркеры
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f, layer) => {
        if (layer === markerLayer && f instanceof Feature) return f;
        return null;
      });

      const target = map.getTargetElement();

      if (feature) {
        target.style.cursor = "pointer";

        if (hoveredFeature !== feature) {
          if (hoveredFeature) hoveredFeature.setStyle(markerStyle);

          feature.setStyle(highlightStyle);
          hoveredFeature = feature;
        }
      } else {
        target.style.cursor = "";
        // 👇 важно: не сбрасываем сразу — добавим микрозадержку
        if (hoveredFeature) {
          setTimeout(() => {
            if (hoveredFeature) hoveredFeature.setStyle(markerStyle);
            hoveredFeature = null;
          }, 60); // 👈 debounce эффект — предотвращает "мигание"
        }
      }
    });
    // Изменение курсора и подсветка при наведении

    dragPanRef.current = map
      .getInteractions()
      .getArray()
      .find((i) => i instanceof DragPan) as DragPan;

    const viewport = map.getViewport();

    const handlePointerDown = (e: PointerEvent) => {
      if (!isDrawing) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drawing.current = true;
      currentCoords.current = [];
      dragPanRef.current?.setActive(false);
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      map.getViewport().style.touchAction = "none";
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
      if (!isDrawing) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drawing.current = false;
      dragPanRef.current?.setActive(true);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      map.getViewport().style.touchAction = "auto";
      if (currentCoords.current.length < 3) return;

      const polygonCoords = currentCoords.current.map((coord) =>
        toLonLat(coord)
      ) as [number, number][];

      localStorage.setItem(POLYGON_STORAGE_KEY, JSON.stringify(polygonCoords));
      const squareBox = getBoundingBox(polygonCoords);
      const squareCoords = createSquarePolygon(squareBox);

      const newFilters = {
        ...locationFilters,
        polygon: squareCoords,
      };

      const query = {
        ...router.query,
        locationfilters: JSON.stringify(newFilters),
      };
      router.push({ pathname: router.pathname, query }, undefined, {
        shallow: true,
      });

      onChangeFilters(newFilters);

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
  }, [isDrawing, locationFilters, router]);

  useEffect(() => {
    if (!mapRef.current) return;
    const viewport = mapRef.current;

    const disableScroll = (e: TouchEvent) => {
      if (isDrawing) {
        e.preventDefault();
      }
    };

    viewport.addEventListener("touchmove", disableScroll, { passive: false });

    return () => {
      viewport.removeEventListener("touchmove", disableScroll);
    };
  }, [isDrawing]);

  useEffect(() => {
    if (!markerSource.current) return;
    if (!Array.isArray(properties)) return;
    const existingFeatures = markerSource.current.getFeatures();
    const existingIds = new Set(existingFeatures.map((f) => f.get("id")));
    const newIds = new Set(properties.map((p) => p.id));

    existingFeatures.forEach((f) => {
      if (!newIds.has(f.get("id"))) {
        markerSource.current.removeFeature(f);
      }
    });

    properties.forEach((p) => {
      if (!existingIds.has(p.id)) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([p.lng, p.lat])),
          id: p.id,
          link: `/property/${p.slug || p.id}`,
        });
        feature.setStyle(markerStyle);
        markerSource.current.addFeature(feature);
      }
    });

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

  useEffect(() => {
    districtsSource.current.clear();
    if (!("isOutOfCity" in (locationFilters ?? {}))) {
      return;
    }
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

    const features = new GeoJSON().readFeatures(kyivDistricts, {
      featureProjection: "EPSG:3857",
    });

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

    let filterPolygon: Polygon | null = null;
    if (
      locationFilters?.polygon &&
      Array.isArray(locationFilters.polygon) &&
      locationFilters.polygon.length > 0
    ) {
      if (savedPolygon.length > 2) {
        const coords3857 = savedPolygon.map((c: any) => fromLonLat(c));

        // Замыкаем полигон
        if (
          coords3857[0][0] !== coords3857[coords3857.length - 1][0] ||
          coords3857[0][1] !== coords3857[coords3857.length - 1][1]
        ) {
          coords3857.push(coords3857[0]);
        }

        filterPolygon = new Polygon([coords3857]);
      }
    }

    const noFilters =
      !locationFilters?.districts || locationFilters.districts.length === 0;

    const holes: [number, number][][] = [];
    const normalize = (str: string) =>
      str.trim().toLowerCase().replace(/['’]/g, "'");

    let districts: string[] = [];

    if (Array.isArray(locationFilters?.districts)) {
      districts = locationFilters.districts.map(normalize);
    } else if (typeof locationFilters?.districts === "string") {
      try {
        const parsed = JSON.parse(locationFilters.districts);
        if (Array.isArray(parsed)) {
          districts = parsed.map(normalize);
        } else {
          districts = [normalize(locationFilters.districts)];
        }
      } catch {
        districts = [normalize(locationFilters.districts)];
      }
    }

    features.forEach((feature) => {
      const rawName = feature.get("NAME") as string;
      const districtName = rawName.replace("район", "").trim();
      const isActive = noFilters || districts.includes(normalize(districtName));

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

    metroCircles.forEach((circle, index) => {
      const feature = new Feature(circle);
      feature.setStyle(
        new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0)",
          }),
          stroke: new Stroke({
            color: metroLines[index] || "blue",
            width: 1,
          }),
        })
      );
      districtsSource.current.addFeature(feature);
    });

    if (filterPolygon) {
      console.log("Adding user polygon to map:", filterPolygon);
      const userFeature = new Feature(filterPolygon);
      userFeature.setStyle(
        new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0)", // без заливки
          }),
          stroke: new Stroke({
            color: "black", // цвет как у метро
            width: 2,
          }),
        })
      );

      districtsSource.current.addFeature(userFeature);
    }

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
    savedPolygon,
  ]);

  useEffect(() => {
    if (!mapInstance.current || !currentCoords.current.length) return;
    const polygonCoords = currentCoords.current.map((c) => c) as [
      number,
      number
    ][];
    const squareBox = getBoundingBox(polygonCoords);
    const squareCoords = createSquarePolygon(squareBox);
    filterMarkers(
      savedPolygon.map((c: any) => fromLonLat(c)),
      squareCoords.map((c) => fromLonLat(c))
    );
  }, [properties, filterMarkers]);
  const handleZoom = (delta: number) => {
    if (!mapInstance.current) return;
    const view = mapInstance.current.getView();
    view.animate({ zoom: view.getZoom()! + delta, duration: 250 });
  };

  const handlePolygonButton = () => {
    if (isDrawing) {
      setIsDrawing(false);
    } else if (currentCoords.current.length > 0) {
      const newFilters = {
        ...locationFilters,
        polygon: [],
      };

      onChangeFilters(newFilters);

      const query = {
        ...router.query,
        locationfilters: JSON.stringify(newFilters),
      };
      router.push({ pathname: router.pathname, query }, undefined, {
        shallow: true,
      });

      drawSource.current.clear();
      currentCoords.current = [];
    } else {
      setIsDrawing(true);
      drawSource.current.clear();
      currentCoords.current = [];
    }
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.drawButtonContainer}>
        <button onClick={handlePolygonButton} className={styles.mapButton}>
          {isDrawing ? "✅" : currentCoords.current.length > 0 ? "✖" : "✏️"}
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
