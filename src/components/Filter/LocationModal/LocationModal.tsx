import { useState, useEffect } from "react";
import styles from "./LocationModal.module.css";

const SHORE_DISTRICTS: Record<string, string[]> = {
  "Лівий берег": ["Дніпровський", "Дарницький", "Лівобережний"],
  "Правий берег": [
    "Печерський",
    "Шевченківський",
    "Подільський",
    "Голосіївський",
    "Солом'янський",
    "Оболонський",
    "Святошинський",
  ],
};

const METRO_LINES: Record<string, string[]> = {
  "Червона лінія": [
    "Академмістечко",
    "Житомирська",
    "Святошин",
    "Нивки",
    "Політехнічний інститут",
    "Вокзальна",
    "Університет",
    "Театральна",
    "Хрещатик",
    "Арсенальна",
    "Лівобережна",
    "Дарниця",
    "Чернігівська",
    "Лісова",
  ],
  "Синя лінія": [
    "Героїв Дніпра",
    "Мінська",
    "Оболонь",
    "Поштова площа",
    "Майдан Незалежності",
    "Площа Льва Толстого",
    "Олімпійська",
    "Палац «Україна»",
    "Либідська",
    "Деміївська",
    "Голосіївська",
    "Васильківська",
    "Теремки",
  ],
  "Зелена лінія": [
    "Сирець",
    "Дорогожичі",
    "Лук’янівська",
    "Золоті ворота",
    "Палац спорту",
    "Кловська",
    "Дружби народів",
    "Видубичі",
    "Славутич",
    "Позняки",
    "Харківська",
    "Вирлиця",
    "Бориспільська",
    "Червоний хутір",
  ],
};

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
}

const DATA_STORAGE_KEY = "locationData"; // для данных с бэка
const FILTERS_STORAGE_KEY = "locationFilters";

export default function LocationModal({
  onClose,
  onSubmit,
}: LocationModalProps) {
  const [locationType, setLocationType] = useState<"kyiv" | "region">("kyiv");

  // UI state
  const [metroOpen, setMetroOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [streetOpen, setStreetOpen] = useState(false);
  const [jkOpen, setJkOpen] = useState(false);
  const [regionDirectionOpen, setRegionDirectionOpen] = useState(false);
  const [regionStreetOpen, setRegionStreetOpen] = useState(false);
  const [regionJkOpen, setRegionJkOpen] = useState(false);

  // selections
  const [selectedMetro, setSelectedMetro] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedStreets, setSelectedStreets] = useState<string[]>([]);
  const [selectedJk, setSelectedJk] = useState<string[]>([]);
  const [selectedDirections, setSelectedDirections] = useState<string[]>([]);

  // backend data
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const [isInitialRender, setIsInitialRender] = useState(true);

  // Загружаем данные с бэка
  useEffect(() => {
    const savedData = localStorage.getItem(DATA_STORAGE_KEY);
    if (savedData) {
      setLocationData(JSON.parse(savedData));
      return; // Данные есть — запрос не нужен
    }

    async function fetchLocationData() {
      try {
        const res = await fetch("http://localhost:3001/items/location");
        const data = await res.json();
        setLocationData(data);
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.error("Ошибка загрузки локаций", err);
      }
    }

    fetchLocationData();
  }, []);

  // Загружаем сохраненные фильтры из localStorage
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

  // сброс фильтров при смене локации (Kyiv/Region)
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    // Сбрасываем все фильтры при смене locationType
    setSelectedMetro([]);
    setSelectedDistricts([]);
    setSelectedStreets([]);
    setSelectedJk([]);
    setSelectedDirections([]);
  }, [locationType]);

  const toggleArrayValue = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  // Метро
  const handleSelectMetroStation = (station: string) => {
    setSelectedMetro(toggleArrayValue(selectedMetro, station));
  };

  const handleSelectMetroLine = (line: string) => {
    const stations = METRO_LINES[line];
    const allSelected = stations.every((s) => selectedMetro.includes(s));
    const newSelected = allSelected
      ? selectedMetro.filter((s) => !stations.includes(s))
      : Array.from(new Set([...selectedMetro, ...stations]));
    setSelectedMetro(newSelected);
  };

  // Районы
  const handleSelectDistrict = (district: string) => {
    setSelectedDistricts(toggleArrayValue(selectedDistricts, district));
  };
  const handleSelectShore = (shore: string) => {
    const districts = SHORE_DISTRICTS[shore];
    const allSelected = districts.every((d) => selectedDistricts.includes(d));
    const newSelected = allSelected
      ? selectedDistricts.filter((d) => !districts.includes(d))
      : Array.from(new Set([...selectedDistricts, ...districts]));
    setSelectedDistricts(newSelected);
  };

  // Streets, ЖК, Directions
  const handleSelectStreet = (street: string) => {
    setSelectedStreets(toggleArrayValue(selectedStreets, street));
  };
  const handleSelectJk = (jk: string) => {
    setSelectedJk(toggleArrayValue(selectedJk, jk));
  };
  const handleSelectDirection = (direction: string) => {
    setSelectedDirections(toggleArrayValue(selectedDirections, direction));
  };

  // Автосабмит и сохранение в localStorage
  // Автосабмит и сохранение в localStorage
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

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

    onSubmit(filters);

    // Сохраняем в localStorage
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  }, [
    locationType,
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
    <div className={styles.modalContent}>
      <div className={styles.locationToggle}>
        <button
          className={`${styles.locationButton} ${
            locationType === "kyiv" ? styles.active : ""
          }`}
          onClick={() => setLocationType("kyiv")}
        >
          м. Київ
        </button>
        <button
          className={`${styles.locationButton} ${
            locationType === "region" ? styles.active : ""
          }`}
          onClick={() => setLocationType("region")}
        >
          Київська область
        </button>
      </div>

      {locationType === "kyiv" ? (
        <div className={styles.locationGroup}>
          {/* Метро */}
          <Dropdown
            title="Метро"
            isOpen={metroOpen}
            onToggle={() => setMetroOpen(!metroOpen)}
          >
            {Object.keys(METRO_LINES).map((line) => {
              const selectedCount = METRO_LINES[line].filter((s) =>
                selectedMetro.includes(s)
              ).length;
              return (
                <div key={line}>
                  <div
                    className={`${styles.dropdownItem} ${
                      METRO_LINES[line].every((s) => selectedMetro.includes(s))
                        ? styles.active
                        : ""
                    }`}
                    style={{ fontWeight: "bold" }}
                    onClick={() => handleSelectMetroLine(line)}
                  >
                    {line}
                    {selectedCount > 0 && ` (${selectedCount})`}
                  </div>
                  {METRO_LINES[line].map((station) => (
                    <div
                      key={station}
                      className={`${styles.dropdownItem} ${
                        selectedMetro.includes(station) ? styles.active : ""
                      }`}
                      style={{ paddingLeft: "20px" }}
                      onClick={() => handleSelectMetroStation(station)}
                    >
                      {station}
                    </div>
                  ))}
                </div>
              );
            })}
          </Dropdown>

          {/* Районы */}
          <Dropdown
            title="Райони"
            isOpen={districtOpen}
            onToggle={() => setDistrictOpen(!districtOpen)}
          >
            {Object.keys(SHORE_DISTRICTS).map((shore) => (
              <div key={shore}>
                <div
                  className={`${styles.dropdownItem} ${
                    SHORE_DISTRICTS[shore].every((d) =>
                      selectedDistricts.includes(d)
                    )
                      ? styles.active
                      : ""
                  }`}
                  style={{ fontWeight: "bold" }}
                  onClick={() => handleSelectShore(shore)}
                >
                  {shore}
                </div>
                {SHORE_DISTRICTS[shore].map((district) => (
                  <div
                    key={district}
                    className={`${styles.dropdownItem} ${
                      selectedDistricts.includes(district) ? styles.active : ""
                    }`}
                    style={{ paddingLeft: "20px" }}
                    onClick={() => handleSelectDistrict(district)}
                  >
                    {district}
                  </div>
                ))}
              </div>
            ))}
          </Dropdown>

          {/* Вулиці */}
          <Dropdown
            title="Вулиця"
            isOpen={streetOpen}
            onToggle={() => setStreetOpen(!streetOpen)}
          >
            {locationData?.kyiv.streets.map((street) => (
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
          </Dropdown>

          {/* ЖК */}
          <Dropdown
            title="ЖК"
            isOpen={jkOpen}
            onToggle={() => setJkOpen(!jkOpen)}
          >
            {locationData?.kyiv.newbuildings.map((jk) => (
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
          </Dropdown>
        </div>
      ) : (
        <div className={styles.locationGroup}>
          {/* Напрямки */}
          <Dropdown
            title="Напрямки"
            isOpen={regionDirectionOpen}
            onToggle={() => setRegionDirectionOpen(!regionDirectionOpen)}
          >
            {locationData?.region.directions.map((dir) => (
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
          </Dropdown>

          {/* Вулиці */}
          <Dropdown
            title="Вулиця"
            isOpen={regionStreetOpen}
            onToggle={() => setRegionStreetOpen(!regionStreetOpen)}
          >
            {locationData?.region.streets.map((street) => (
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
          </Dropdown>

          {/* ЖК */}
          <Dropdown
            title="ЖК"
            isOpen={regionJkOpen}
            onToggle={() => setRegionJkOpen(!regionJkOpen)}
          >
            {locationData?.region.newbuildings.map((jk) => (
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
          </Dropdown>
        </div>
      )}

      <div className={styles.modalActions}>
        <button onClick={onClose} className={styles.cancelButton}>
          Скасувати
        </button>
      </div>
    </div>
  );
}
