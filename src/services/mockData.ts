export const properties: {
  id: string;
  title: string;
  type: "rent" | "sale";
  price: number;
  rooms: number;
  area: number;
  image: string;
  location: { lat: number; lng: number };
}[] = [
  {
    id: "1",
    title: "Квартира в центрі",
    type: "rent",
    price: 12000,
    rooms: 2,
    area: 50,
    image: "apartment1.jpg",
    location: { lat: 50.4501, lng: 30.5234 },
  },
  {
    id: "2",
    title: "Будинок на околиці",
    type: "sale",
    price: 85000,
    rooms: 4,
    area: 120,
    image: "house1.jpg",
    location: { lat: 50.4547, lng: 30.5238 },
  },
  // ...other properties
];

export const team = [
  { id: "1", name: "Іван Іванов", role: "Ріелтор", photo: "/images/team1.jpg" },
  {
    id: "2",
    name: "Олена Петрівна",
    role: "Менеджер",
    photo: "/images/team2.jpg",
  },
];
