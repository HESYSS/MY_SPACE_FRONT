export interface Property {
  id: string;
  title: string;
  type: "rent" | "sale";
  price: number;
  rooms: number;
  area: number;
  image: string;
  location: { lat: number; lng: number };
}
