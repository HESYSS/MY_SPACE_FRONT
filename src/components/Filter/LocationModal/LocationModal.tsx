import { useState, useEffect, useRef } from "react";
import styles from "./LocationModal.module.css";
import { useTranslation } from "react-i18next";
import { METRO_LINES, SHORE_DISTRICTS } from "./locationFiltersConfig";

interface LocationData {
  kyiv: {
    streets: string[];
    newbuildings: string[];
  };
  region: {
    streets: string[];
    newbuildings: string[];
    directions: string[];
  };
}

interface LocationModalProps {
  onClose: () => void;
  onSubmit: (filters: any) => void;
  triggerRef: React.RefObject<HTMLElement>; // Добавляем пропс для ref триггера
}

const DATA_STORAGE_KEY = "locationData";
const FILTERS_STORAGE_KEY = "locationFilters";
const POLYGON_STORAGE_KEY = "mapPolygon";

function loadPolygon() {
  const stored = localStorage.getItem(POLYGON_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export default function LocationModal({
  onClose,
  onSubmit,
  triggerRef,
}: LocationModalProps) {
  const [locationType, setLocationType] = useState<"kyiv" | "region">("kyiv");
  const modalRef = useRef<HTMLDivElement>(null); // Ref для самой модалки

  const [metroOpen, setMetroOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [streetOpen, setStreetOpen] = useState(false);
  const [jkOpen, setJkOpen] = useState(false);
  const [regionDirectionOpen, setRegionDirectionOpen] = useState(false);
  const [regionStreetOpen, setRegionStreetOpen] = useState(false);
  const [regionJkOpen, setRegionJkOpen] = useState(false);
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language;

  const [selectedMetro, setSelectedMetro] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedStreets, setSelectedStreets] = useState<string[]>([]);
  const [selectedJk, setSelectedJk] = useState<string[]>([]);
  const [selectedDirections, setSelectedDirections] = useState<string[]>([]);

  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);

  // Обработчик для закрытия по клику вне
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Проверяем, существует ли модалка и триггер
      const isClickOnModal = modalRef.current && modalRef.current.contains(event.target as Node);
      const isClickOnTrigger = triggerRef.current && triggerRef.current.contains(event.target as Node);

      // Если клик не на модалке и не на триггере, закрываем
      if (!isClickOnModal && !isClickOnTrigger) {
        onClose();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, triggerRef, onClose]);


  useEffect(() => {
    const savedData = localStorage.getItem(DATA_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.lang === lang) {
        const data = {
          kyiv: parsedData.kyiv,
          region: parsedData.region,
        };
        setLocationData(data);
        return;
      }
    }
    async function fetchLocationData() {
      try {
        const backendUrl = process.env.REACT_APP_API_URL;
        const res = await fetch(`${backendUrl}/items/location`, {
          headers: {
            "Accept-Language": lang,
          },
        });
        const data = await res.json();
        setLocationData(data);
        const dataWithLang = {
          ...data,
          lang: lang,
        };
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(dataWithLang));
      } catch (err) {
        console.error("Ошибка загрузки локаций", err);
      }
    }
    fetchLocationData();
  }, [lang]);

  useEffect(() => {
    const saved = localStorage.getItem(FILTERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedMetro(parsed.metro || []);
      setSelectedDistricts(parsed.districts || []);
      setSelectedStreets(parsed.streets || []);
      setSelectedJk(parsed.newbuildings || []);
      setSelectedDirections(parsed.directions || []);
      setLocationType(parsed.isOutOfCity ? "region" : "kyiv");
    }
  }, []);

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }
    const newFilters: any = {
      isOutOfCity: locationType === "region",
      streets: [],
      newbuildings: [],
    };
    if (locationType === "kyiv") {
      newFilters.metro = [];
      newFilters.districts = [];
    } else {
      newFilters.directions = [];
    }
    localStorage.removeItem(FILTERS_STORAGE_KEY);
    localStorage.removeItem(POLYGON_STORAGE_KEY);
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(newFilters));
    onSubmit(newFilters);
  }, [locationType]);

  const toggleArrayValue = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const handleSelectMetroStation = (station: string) => {
    setSelectedMetro(toggleArrayValue(selectedMetro, station));
  };

  const handleSelectMetroLine = (line: string) => {
    const stations = METRO_LINES[line]["ua"];
    const allSelected = stations.every((s) => selectedMetro.includes(s));
    const newSelected = allSelected
      ? selectedMetro.filter((s) => !stations.includes(s))
      : Array.from(new Set([...selectedMetro, ...stations]));
    setSelectedMetro(newSelected);
  };

  const handleSelectDistrict = (district: string) => {
    setSelectedDistricts(toggleArrayValue(selectedDistricts, district));
  };

  const handleSelectShore = (shore: string) => {
    const districts = SHORE_DISTRICTS[shore]["ua"];
    const allSelected = districts.every((d) => selectedDistricts.includes(d));
    const newSelected = allSelected
      ? selectedDistricts.filter((d) => !districts.includes(d))
      : Array.from(new Set([...selectedDistricts, ...districts]));
    setSelectedDistricts(newSelected);
  };

  const handleSelectStreet = (street: string) => {
    setSelectedStreets(toggleArrayValue(selectedStreets, street));
  };

  const handleSelectJk = (jk: string) => {
    setSelectedJk(toggleArrayValue(selectedJk, jk));
  };

  const handleSelectDirection = (direction: string) => {
    setSelectedDirections(toggleArrayValue(selectedDirections, direction));
  };

  useEffect(() => {
    if (isInitialRender) return;
    const filters: any = {
      isOutOfCity: locationType === "region",
      streets: selectedStreets,
      newbuildings: selectedJk,
    };
    if (locationType === "kyiv") {
      filters.metro = selectedMetro;
      filters.districts = selectedDistricts;
    } else {
      filters.directions = selectedDirections;
    }
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    onSubmit({ ...filters, polygon: loadPolygon() });
  }, [
    selectedMetro,
    selectedDistricts,
    selectedStreets,
    selectedJk,
    selectedDirections,
  ]);

  const Dropdown = ({
    title,
    children,
    isOpen,
    onToggle,
  }: {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <div className={styles.dropdown}>
      <button onClick={onToggle} className={styles.dropdownButton}>
        <span>{title}</span>
        <span className={isOpen ? styles.chevronOpen : ""}>▼</span>
      </button>
      {isOpen && <div className={styles.dropdownContent}>{children}</div>}
    </div>
  );

  return (
    <div className={styles.modalContent} ref={modalRef}>
      <div className={styles.locationToggle}>
        <button
          className={`${styles.locationButton} ${
            locationType === "kyiv" ? styles.active : ""
          }`}
          onClick={() => setLocationType("kyiv")}
        >
          {t("kyiv_city")}
        </button>
        <button
          className={`${styles.locationButton} ${
            locationType === "region" ? styles.active : ""
          }`}
          onClick={() => setLocationType("region")}
        >
          {t("kyiv_region")}
        </button>
      </div>
      {locationType === "kyiv" ? (
        <div className={styles.locationGroup}>
          <Dropdown
            title={t("metro")}
            isOpen={metroOpen}
            onToggle={() => setMetroOpen(!metroOpen)}
          >
            <div className={styles.columnsWrapper}>
              {Object.keys(METRO_LINES).map((line) => {
                const selectedCount = METRO_LINES[line]["ua"].filter((s) =>
                  selectedMetro.includes(s)
                ).length;
                return (
                  <div key={line} className={styles.metroColumn}>
                    <div
                      className={`${styles.dropdownItem} ${
                        METRO_LINES[line]["ua"].every((s) =>
                          selectedMetro.includes(s)
                        )
                          ? styles.active
                          : ""
                      }`}
                      style={{ fontWeight: "bold" }}
                      onClick={() => handleSelectMetroLine(line)}
                    >
                      {t(line)}
                      {selectedCount > 0 && ` (${selectedCount})`}
                    </div>
                    <div className={styles.dropdownSubList}>
                      {METRO_LINES[line]["ua"].map((stationUa, index) => {
                        const stationEn = METRO_LINES[line][lang][index];
                        return (
                          <div
                            key={stationUa}
                            className={`${styles.dropdownItem} ${
                              selectedMetro.includes(stationUa)
                                ? styles.active
                                : ""
                            }`}
                            style={{ paddingLeft: "20px" }}
                            onClick={() => handleSelectMetroStation(stationUa)}
                          >
                            {stationEn}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Dropdown>
          <Dropdown
            title={t("districts")}
            isOpen={districtOpen}
            onToggle={() => setDistrictOpen(!districtOpen)}
          >
            <div className={styles.districtsWrapper}>
              {Object.keys(SHORE_DISTRICTS).map((shore) => (
                <div key={shore} className={styles.districtColumn}>
                  <div
                    className={`${styles.dropdownItem} ${
                      SHORE_DISTRICTS[shore]["ua"].every((d) =>
                        selectedDistricts.includes(d)
                      )
                        ? styles.active
                        : ""
                    }`}
                    style={{ fontWeight: "bold" }}
                    onClick={() => handleSelectShore(shore)}
                  >
                    {t(shore)}
                  </div>
                  {SHORE_DISTRICTS[shore]["ua"].map((districtUa, index) => {
                    const districtEn = SHORE_DISTRICTS[shore][lang][index];
                    return (
                      <div
                        key={districtUa}
                        className={`${styles.dropdownItem} ${
                          selectedDistricts.includes(districtUa)
                            ? styles.active
                            : ""
                        }`}
                        style={{ paddingLeft: "20px" }}
                        onClick={() => handleSelectDistrict(districtUa)}
                      >
                        {districtEn}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Dropdown>
          <Dropdown
            title={t("street")}
            isOpen={streetOpen}
            onToggle={() => setStreetOpen(!streetOpen)}
          >
            <div className={styles.inlineList}>
              {locationData?.kyiv?.streets.map((street) => (
                <div
                  key={street}
                  className={`${styles.dropdownItem} ${
                    selectedStreets.includes(street) ? styles.active : ""
                  }`}
                  onClick={() => handleSelectStreet(street)}
                >
                  {street}
                </div>
              ))}
            </div>
          </Dropdown>
          <Dropdown
            title={t("jk")}
            isOpen={jkOpen}
            onToggle={() => setJkOpen(!jkOpen)}
          >
            <div className={styles.inlineList}>
              {locationData?.kyiv?.newbuildings.map((jk) => (
                <div
                  key={jk}
                  className={`${styles.dropdownItem} ${
                    selectedJk.includes(jk) ? styles.active : ""
                  }`}
                  onClick={() => handleSelectJk(jk)}
                >
                  {jk}
                </div>
              ))}
            </div>
          </Dropdown>
        </div>
      ) : (
        <div className={styles.locationGroup}>
          <Dropdown
            title={t("directions")}
            isOpen={regionDirectionOpen}
            onToggle={() => setRegionDirectionOpen(!regionDirectionOpen)}
          >
            <div className={styles.inlineList}>
              {locationData?.region?.directions.map((dir) => (
                <div
                  key={dir}
                  className={`${styles.dropdownItem} ${
                    selectedDirections.includes(dir) ? styles.active : ""
                  }`}
                  onClick={() => handleSelectDirection(dir)}
                >
                  {dir}
                </div>
              ))}
            </div>
          </Dropdown>
          <Dropdown
            title={t("street")}
            isOpen={regionStreetOpen}
            onToggle={() => setRegionStreetOpen(!regionStreetOpen)}
          >
            <div className={styles.inlineList}>
              {locationData?.region?.streets.map((street) => (
                <div
                  key={street}
                  className={`${styles.dropdownItem} ${
                    selectedStreets.includes(street) ? styles.active : ""
                  }`}
                  onClick={() => handleSelectStreet(street)}
                >
                  {street}
                </div>
              ))}
            </div>
          </Dropdown>
          <Dropdown
            title={t("jk")}
            isOpen={regionJkOpen}
            onToggle={() => setRegionJkOpen(!regionJkOpen)}
          >
            <div className={styles.inlineList}>
              {locationData?.region?.newbuildings.map((jk) => (
                <div
                  key={jk}
                  className={`${styles.dropdownItem} ${
                    selectedJk.includes(jk) ? styles.active : ""
                  }`}
                  onClick={() => handleSelectJk(jk)}
                >
                  {jk}
                </div>
              ))}
            </div>
          </Dropdown>
        </div>
      )}
    </div>
  );
}