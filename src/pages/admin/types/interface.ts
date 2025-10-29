export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  experienceYears?: number;
  profile?: string;
  aboutMe?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  positionEn?: string;
  profileEn?: string;
  aboutMeEn?: string;
  isPARTNER: boolean;
  isMANAGER: boolean;
  isACTIVE: boolean;
  isSUPERVISOR: boolean;
  photoUrl?: string;
}

export interface SiteImage {
  id: number;
  name: string;
  url: string;
}

export interface Admin {
  id: number;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemImage {
  id: number;
  url: string;
  order: number;
  isActive: boolean;
}

export interface Item {
  id: number;
  title: string;
  images: ItemImage[];
}

export interface Offer {
  id: number;
  clientName: string;
  phoneNumber: string;
  // ВИПРАВЛЕННЯ: Уніфікуйте типізацію поля 'reason'
  reason: "BUYING" | "SELLING"; // Це той самий тип, що використовується в JSX
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND";
  createdAt: string;
  status: "PENDING" | "PROCESSED" | "COMPLETED";
}