import { Property } from "../../types/property";
import { Link } from "react-router-dom";

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  return (
    <div className="property-card">
      <img src={property.image} alt={property.title} />
      <h3>{property.title}</h3>
      <p>Ціна: {property.price} грн</p>
      <p>Кімнат: {property.rooms}</p>
      <p>Площа: {property.area} м²</p>
      <Link to={`/property/${property.id}`}>Детальніше</Link>
    </div>
  );
}
