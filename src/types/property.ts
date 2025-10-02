export interface Property {
  id: string;
  title: string;
  description: string;
  prices: Price[];
  rooms: number;
  area: number;
  firstImage: string;
  district: string;
  type: string;
  updatedAt: string;
  slug: string;
}
interface Price {
  value: number;
  currency: string;
}
