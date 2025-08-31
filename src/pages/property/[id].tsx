import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MapWrapper from "@/components/Map/MapWrapper";
import { properties } from "@/services/mockData";

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>();
  const property = properties.find((p) => p.id === id);

  if (!property) return <p>Обʼєкт не знайдено</p>;

  return (
    <div>
      <main>
        <h1>{property.title}</h1>
        <img src={property.image} alt={property.title} />
        <p>Ціна: {property.price} грн</p>
        <p>Кімнат: {property.rooms}</p>
        <p>Площа: {property.area} м²</p>
      </main>
    </div>
  );
}
