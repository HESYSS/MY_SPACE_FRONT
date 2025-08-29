export interface Property {
  id: string;
  title: string;
  discription: string;
  prices: Price[];
  rooms: number;
  area: number;
  firstImage: string;
  street: string;
  type: string;
  сreatedAt: string;
}
interface Price {
  value: number;
  currency: string;
}
